import { ExpenseRepository } from "./expense.repository";
import { ExpenseDto, expenseDto } from "./dto/expense-dto";
import { UserRepository } from "../user/user.repository";
import { UserService } from "../user/user.service";
import { NotFoundError, ValidationError } from "../../utilities/http-error";
import { GroupService } from "../group/group.service";
import { getNextPermutation } from "../../utilities/get-next-permutation";

export interface IExpenseService {
    validateExpense: (newExpenseDto: ExpenseDto) => Promise<boolean>,
    createExpense: (newExpenseDto: ExpenseDto) => Promise<Expense>,
    getExpenseByGroupId: (groupId: number) => Promise<Expense[]>;
    getGroupEvenTransactions: (groupId: number) => Promise<Transaction[]>;
    calculateOptimumTransactions: (expenses: Expense[], memberIds: number[]) => Transaction[];
    getTransactions: (debtors: Account[], creditors: Account[]) => Transaction[];
}

export class ExpenseService implements IExpenseService {
    constructor(private expenseRepository: ExpenseRepository, private userService: UserService, private groupService: GroupService) {}

    validateExpense = async (newExpenseDto: ExpenseDto): Promise<boolean> => {
        if (newExpenseDto.debtors.length == 0) {
            throw new ValidationError("debtors field is empty.");
        }
        if (newExpenseDto.debtors.some(d => d.debtorId == newExpenseDto.creditorId)) {
            throw new ValidationError("Creditor must not be one of the debtors.")
        }
        if (newExpenseDto.debtors.some(d => d.amount <= 0)) {
            throw new ValidationError("amount must be positive number.")
        }
        if (!(await this.userService.userExists(newExpenseDto.creditorId))) {
            throw new NotFoundError("creditorId does not exist");
        }
        if (!newExpenseDto.debtors.every(async(e) => (await this.userService.userExists(e.debtorId)))) {
            throw new NotFoundError("debtor id does not exist")
        }
        if (!(await this.groupService.groupExists(newExpenseDto.groupId))) {
            throw new NotFoundError("Group does not exist");
        }
        return true;
    }

    createExpense = async(newExpenseDto: ExpenseDto) => {
        await this.validateExpense(newExpenseDto);
        const newExpense = await this.expenseRepository.add(newExpenseDto);
        return newExpense;
    }

    getExpenseByGroupId = async (groupId: number): Promise<Expense[]> => {
        return await this.expenseRepository.getExpenseByGroup(groupId);
    }

    getGroupEvenTransactions = async (groupId: number) => {
        const expenses = await this.getExpenseByGroupId(groupId);
        const memberIds = (await this.groupService.getGroup(groupId)).members;
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
                        amount: Math.abs(d.account)
                    });
                    c.account -= d.account;
                    d.account = 0;
                } else {
                    transactions.push({
                        giverId: d.memberId, 
                        takerId: c.memberId, 
                        amount: c.account
                    });
                    d.account += c.account;
                    c.account = 0;
                }
            }
        }
        return transactions;
    }
}