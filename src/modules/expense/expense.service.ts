import { ExpenseTracker } from "./expense-tracker";
import { ExpenseDto, expenseDto } from "./dto/expense-dto";
import { userManager } from "../route/user.route";

export interface IExpenseService {
    canCreateExpense: (data: unknown) => boolean ,
    createExpense: (data: unknown) => Expense,
}

export class ExpenseService implements IExpenseService {
    constructor(private expenseTracker: ExpenseTracker) {}

    canCreateExpense = (data: unknown): boolean => {
        const newExpenseDto = expenseDto.parse(data);
        if (!userManager.userExists(newExpenseDto.creditorId)) {
            return false;
        }
        if (!newExpenseDto.debtors.every(e => userManager.userExists(e.debtorId))) {
            return false;
        }
        return true;
    }

    createExpense = (body: unknown): Expense => {
        const newExpenseDto = expenseDto.parse(body);
        const newExpense = this.expenseTracker.add(newExpenseDto);
        return newExpense;
    }
}