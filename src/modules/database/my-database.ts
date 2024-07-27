import { RemoveId } from "./in-memory-database";

export interface IMyDatabase <T>{
    save: (data: RemoveId<T>) => Promise<T>;
    find: (id: number) => Promise<T|undefined>;
    findAll: (fn: (e: T) => boolean) => Promise<T[]>;
    update: (data: T) => Promise<T>;
    delete: (id: number) => Promise<void>;
}

export class MyDatabase<T> implements IMyDatabase<T> {
    constructor() {}

    save = async (data: RemoveId<T>): Promise<T> => {
        const jsonText = JSON.stringify(data);
        throw new Error("Method not implemented yet.");
    }

    find = async (id: number): Promise<T> => {
        throw new Error("Method not implemented yet.");
    }

    findAll = async <T>(fn: () => boolean): Promise<T[]> => {
        throw new Error("Method not implemented yet.");
    }

    update = async <T>(data: T): Promise<T> => {
        throw new Error("Method not implemented yet.");
    }

    delete = async (id: number): Promise<void> => {
        throw new Error("Method not implemented yet.")
    }
}