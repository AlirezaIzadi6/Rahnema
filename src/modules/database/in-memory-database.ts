import { arrayOutputType } from "zod";
import { IMyDatabase } from "./my-database";
import { expenseDto } from "../expense/dto/expense-dto";

export type AddId<T> = T&{id: number};

export class InMemoryDatabase<T> implements IMyDatabase {
    private table: Array<T>;
    private lastId: number;
    constructor() {
        this.table = [];
        this.lastId = 1;
    }

    save = async <T>(data: T): Promise<AddId<T>> => {
        const toSave: AddId<T> = {id: this.lastId, ...data};
        this.table.push(toSave);
    }

    
    find = async <T>(id: number): Promise<T> => {
        throw new Error("Method not implemented yet.");
    }

    findAll = async <T>(fn: () => boolean): Promise<T[]> => {
        throw new Error("Method not implemented yet.");
    }

    update = async <T>(data: T): Promise<T> => {
        throw new Error("Method not implemented yet.");
    }

    delete = async (id: number): Promise<boolean> => {
        throw new Error("Method not implemented yet.")
    }
}