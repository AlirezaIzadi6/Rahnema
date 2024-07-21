export class ExpenseTracker {
    private expenses: Expense[];
    private lastId: number;
    constructor() {
        this.expenses = [];
        this.lastId = 0;
    }
    add = (expense: Expense) => {
        this.expenses.push(expense);
    }
}