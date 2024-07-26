import { ExpenseRepository } from "./expense.repository";
import { ExpenseDto, expenseDto } from "./dto/expense-dto";
import { UserRepository } from "../user/user.repository";
import { UserService } from "../user/user.service";
import { NotFoundError, ValidationError } from "../../utilities/http-error";
import { GroupService } from "../group/group.service";
import { getNextPermutation } from "../../utilities/get-next-permutation";

export interface IExpenseService {
    validateExpense: (newExpenseDto: ExpenseDto) => boolean ,
    createExpense: (newExpenseDto: ExpenseDto) => Promise<Expense>,
    getExpenseByGroupId: (groupId: number) => Expense[];
    getGroupEvenTransactions: (groupId: number) => Transaction[];
    calculateOptimumTransactions: (expenses: Expense[], memberIds: number[]) => Transaction[];
    getTransactions: (debtors: Account[], creditors: Account[]) => Transaction[];
}

export class ExpenseService implements IExpenseService {
    constructor(private expenseRepository: ExpenseRepository, private userService: UserService, private groupService: GroupService) {}

    validateExpense = (newExpenseDto: ExpenseDto): boolean => {
        if (newExpenseDto.debtors.length == 0) {
            throw new ValidationError("debtors field is empty.");
        }
        if (newExpenseDto.debtors.some(d => d.debtorId == newExpenseDto.creditorId)) {
            throw new ValidationError("Creditor must not be one of the debtors.")
        }
        if (newExpenseDto.debtors.some(d => d.amount <= 0)) {
            throw new ValidationError("amount must be positive number.")
        }
        if (!this.userService.userExists(newExpenseDto.creditorId)) {
            throw new NotFoundError("creditorId does not exist");
        }
        if (!newExpenseDto.debtors.every(e => this.userService.userExists(e.debtorId))) {
            throw new NotFoundError("debtor id does not exist")
        }
        if (!this.groupService.groupExists(newExpenseDto.groupId)) {
            throw new NotFoundError("Group does not exist");
        }
        return true;
    }

    createExpense = async(newExpenseDto: ExpenseDto) => {
        this.validateExpense(newExpenseDto);
        const newExpense = await this.expenseRepository.add(newExpenseDto);
        return newExpense;
    }

    getExpenseByGroupId = (groupId: number): Expense[] => {
        return this.expenseRepository.getExpenseByGroup(groupId);
    }

    getGroupEvenTransactions = (groupId: number) => {
        const expenses = this.getExpenseByGroupId(groupId);
        const memberIds = this.groupService.getGroup(groupId).members;
        return this.calculateOptimumTransactions(expenses, memberIds);
    }

    calculateOptimumTransactions = (expenses: Expense[], memberIds: number[]) => {
        const memberAccount = memberIds.map(x => {
            return {
                memberId: x,
                account: expenses.reduce((prev: number, cur: Expense) => {
                    prev += cur.debtors.reduce((balance: number, item: ExpenseItem) => {
                        if (cur.creditorId == x && item.debtorId != x && memberIds.includes(item.debtorId)) {
                            balance += item.amount;
                        } else if (cur.creditorId != x && item.debtorId == x && memberIds.includes(cur.creditorId)) {
                            balance -= item.amount;
                        }
                        return balance;
                    }, 0);
                    return prev;
                }, 0)
            }
        });
        const debtors = memberAccount.filter(m => m.account < 0);
        const creditors = memberAccount.filter(m => m.account > 0);
        if (creditors.length == 0 && debtors.length == 0) {
            return [];
        } 
        let result: Transaction[] = [];
        let debtorIndexes: number[]|undefined = debtors.map((x, i) => i);
        while(debtorIndexes) {
            let creditorIndexes: number[]|undefined = creditors.map((x, i) => i);
            while(creditorIndexes) {
                const transactions = this.getTransactions(debtors, creditors);
                if (result.length == 0 || transactions.length <= result.length) {
                    result = transactions;
                }
                creditorIndexes = getNextPermutation([...creditorIndexes], creditorIndexes.length)
            }
            debtorIndexes = getNextPermutation([...debtorIndexes], debtors.length)
        }
        return result;
    }

    getTransactions = (debtors: Account[], creditors: Account[]): Transaction[] => {
        const debtorsTotal = debtors.reduce((prev, cur) => prev += cur.account, 0);
        const creditorsTotal = creditors.reduce((prev, cur) => prev += cur.account, 0);
        if (Math.abs(debtorsTotal) != creditorsTotal) {
            throw new Error("invalid expenses");
        } else if (creditors.length == 0 || debtors.length == 0) {
            throw new Error("invalid expenses");
        } 

        const transactions: Transaction[] = [];
        for (let d of debtors) {
            for (let c of creditors) {
                if (d.account == 0) {
                    break;
                }
                if (c.account == 0) {
                    continue;
                }
                if (Math.abs(d.account) < c.account) {
                    transactions.push({
                        giverId: d.memberId, 
                        takerId: c.memberId, 
                        amount: d.account
                    });
                    c.account -= d.account;
                    d.account = 0;
                } else {
                    transactions.push({
                        giverId: d.memberId, 
                        takerId: c.memberId, 
                        amount: c.account
                    });
                    d.account -= c.account;
                    c.account = 0;
                }
            }
        }
        return transactions;
    }
}