import { ExpenseDto } from "./dto/expense-dto";

export class ExpenseTracker {
    private expenses: Expense[];
    private lastId: number;
    constructor() {
        this.expenses = [];
        this.lastId = 0;
    }

    add = (newExpenseDto: ExpenseDto) => {
        const expense: Expense = {
            id: this.lastId,
            creditorId: newExpenseDto.creditorId,
            description: newExpenseDto.description,
            debtors: newExpenseDto.debtors
        };
        this.expenses.push(expense);
        this.lastId++;
        return expense;
    }

    expenseExists = (id: number): boolean => {
        return this.expenses.find(e => e.id === id) != undefined
    }
}