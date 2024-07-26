import { ExpenseDto } from "./dto/expense-dto";

export interface IExpenseRepository {
    add: (newExpenseDto: ExpenseDto) => Expense,
    expenseExists: (id: number) => boolean,
    getCreditorExpenses: (creditorId: number) => ExpenseItem[],
    getDebtorExpenses: (debtorId: number) => ExpenseItem[],
    getExpenseById: (id: number) => Expense|undefined,
}

export class ExpenseRepository implements IExpenseRepository {
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
            groupId: newExpenseDto.groupId,
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

    getCreditorExpenses = (creditorId: number): ExpenseItem[] => {
        return this.expenses.filter(e => e.creditorId == creditorId).flatMap(e => e.debtors);
    }

    getDebtorExpenses = (debtorId: number): ExpenseItem[] => {
        return this.expenses.flatMap(e => e.debtors.filter(d => d.debtorId == debtorId));
    }

    getExpenseById = (id: number): Expense|undefined => {
        return this.expenses.find(e => e.id == id);
    }
}