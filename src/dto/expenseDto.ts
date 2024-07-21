import {string, z} from "zod";

const expenseItemDto = z.object({
    debtorId: z.number(),
    amount: z.number(),
});

const expenseDto = z.object({
    description: z.string().nonempty(),
    debtors: z.array(expenseItemDto),
});

export type ExpenseItemDto = z.infer<typeof expenseItemDto>;
export type ExpenseDto = z.infer<typeof expenseDto>;
