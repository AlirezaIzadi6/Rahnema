import {number, z} from "zod";
import { expenseItemDto } from "../src/modules/expense/dto/expense-dto";
import { Group } from "../src/modules/group/group";

export function isUserArray(data: User[]): data is User[] {
    return Array.isArray(data) && data.every(u => isUser(u));
}

export function isUser(data: User): data is User {
    return typeof(data.id) === "number" && typeof(data.name) === "string";
}

export function isExpense(data: unknown): data is Expense {
    try {
        const expenseZ = z.object({
            id: z.number(),
            creditorId: z.number(),
            description: z.string().nonempty(),
            debtors: z.array(expenseItemDto)
        });
        expenseZ.parse(data);
        return true;
    } catch {
        return false;
    }
}

const userZ = z.object({
    id: z.number(),
    name: z.string()
});

export const makeUser = (data: unknown): User => {
    return userZ.parse(data);
}

const groupZ = z.object({
    id: z.number(),
    name: z.string(),
    members: z.array(z.number())
});

export const makeGroup = (data: unknown): Group => {
    return groupZ.parse(data);
}

const expenseItemZ = z.object({
    debtorId: z.number(),
    amount: z.number(),
});

const expenseZ = z.object({
    id: z.number(),
    groupId: z.number(),
    creditorId: z.number(),
    description: z.string().nonempty(),
    debtors: z.array(expenseItemZ),
})

export const makeExpense = (data: unknown): Expense => {
    return expenseZ.parse(data);
}