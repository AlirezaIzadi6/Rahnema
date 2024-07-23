import {z} from "zod";
import { expenseItemDto } from "../src/modules/expense/dto/expense-dto";

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