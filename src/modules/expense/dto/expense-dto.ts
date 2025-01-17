import {string, z} from "zod";

export const expenseItemDto = z.object({
    debtorId: z.number(),
    amount: z.number(),
});

export const expenseDto = z.object({
    creditorId: z.number(),
    groupId: z.number(),
    description: z.string().nonempty(),
    debtors: z.array(expenseItemDto),
});

export type ExpenseItemDto = z.infer<typeof expenseItemDto>;
export type ExpenseDto = z.infer<typeof expenseDto>;
