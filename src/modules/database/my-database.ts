import { AddId } from "./in-memory-database";

export interface IMyDatabase {
    save: <T, K extends AddId<T>>(data: T) => Promise<K>;
    find: <T>(id: number) => Promise<T>;
    findAll: <T>(fn: () => boolean) => Promise<T[]>;
    update: <T>(data: T) => Promise<T>;
    delete: (id: number) => Promise<boolean>;
}

export class MyDatabase implements IMyDatabase {
    constructor() {}

    save = async <T, K>(data: T): Promise<K> => {
        const jsonText = JSON.stringify(data);
        throw new Error("Method not implemented yet.");
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