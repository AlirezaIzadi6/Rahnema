import { arrayOutputType } from "zod";
import { IMyDatabase } from "./my-database";
import { expenseDto } from "../expense/dto/expense-dto";

export type RemoveId<T> = Omit<T, "id">;

export class InMemoryDatabase<T extends {id: number}> implements IMyDatabase<T> {
    private table: Array<T>;
    private lastId: number;
    constructor() {
        this.table = [];
        this.lastId = 1;
    }

    save = async(data: RemoveId<T>): Promise<T> => {
        const toSave = {id: this.lastId, ...data} as T;
        this.table.push(toSave);
        return toSave;
    }

    find = async (id: number): Promise<T|undefined> => {
        return await this.table.find(e => e.id == id);
    }

    findAll = async (fn: (e: T) => boolean): Promise<T[]> => {
        return this.table.filter(e => fn(e));
    }

    update = async (data: T): Promise<T> => {
        const index = this.table.findIndex(e => e.id == data.id);
        this.table[index] = data;
        return this.table[index];
    }

    delete = async (id: number): Promise<void> => {
        const index = this.table.findIndex(e => e.id == id);
        if (index == -1) {
            throw new Error("Invalid id");
        }
        this.table.splice(index, 1);
    }
}