import { InMemoryDatabase } from "../database/in-memory-database";
import { IMyDatabase } from "../database/my-database";
import { ExpenseDto } from "./dto/expense-dto";

export interface IExpenseRepository {
    add: (newExpenseDto: ExpenseDto) => Promise<Expense>,
    expenseExists: (id: number) => Promise<boolean>,
    getExpenseById: (id: number) => Promise<Expense|undefined>,
}

export class ExpenseRepository implements IExpenseRepository {
    private inMemoryDatabase: IMyDatabase<Expense>;
    constructor() {
        this.inMemoryDatabase = new InMemoryDatabase();
    }

    add = async (newExpenseDto: ExpenseDto) => {
        const expense = await this.inMemoryDatabase.save(newExpenseDto);
        return expense;
    }

    expenseExists = async (id: number): Promise<boolean> => {
        return await this.inMemoryDatabase.find(id) != undefined
    }

    getExpenseByGroup = async (groupId: number): Promise<Expense[]> => {
        return this.inMemoryDatabase.findAll(e => e.groupId == groupId);
    }

    getExpenseById = async (id: number): Promise<Expense|undefined> => {
        return await this.inMemoryDatabase.find(id);
    }
}