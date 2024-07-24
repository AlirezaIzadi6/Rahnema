import { ExpenseTracker } from "./expense-tracker";
import { ExpenseDto, expenseDto } from "./dto/expense-dto";
import { UserManager } from "../user/user-manager";
import { UserService } from "../user/user.service";
import { NotFoundError } from "../../utilities/not-found-error";

export interface IExpenseService {
    canCreateExpense: (newExpenseDto: ExpenseDto) => boolean ,
    createExpense: (newExpenseDto: ExpenseDto) => Promise<Expense>,
    
}

export class ExpenseService implements IExpenseService {
    constructor(private expenseTracker: ExpenseTracker, private userService: UserService) {}

    canCreateExpense = (newExpenseDto: ExpenseDto): boolean => {
        if (!this.userService.userExists(newExpenseDto.creditorId)) {
            return false;
        }
        if (!newExpenseDto.debtors.every(e => this.userService.userExists(e.debtorId))) {
            return false;
        }
        return true;
    }

    createExpense = async(newExpenseDto: ExpenseDto) => {
        if (!this.canCreateExpense(newExpenseDto)) {
            throw new NotFoundError("User not found");
        }
        const newExpense = await this.expenseTracker.add(newExpenseDto);
        return newExpense;
    }
}