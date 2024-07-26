import { ExpenseRepository } from "./expense.repository";
import { ExpenseDto, expenseDto } from "./dto/expense-dto";
import { UserRepository } from "../user/user.repository";
import { UserService } from "../user/user.service";
import { NotFoundError, ValidationError } from "../../utilities/http-error";
import { GroupService } from "../group/group.service";

export interface IExpenseService {
    validateExpense: (newExpenseDto: ExpenseDto) => boolean ,
    createExpense: (newExpenseDto: ExpenseDto) => Promise<Expense>,
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
}