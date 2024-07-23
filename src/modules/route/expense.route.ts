import {Router} from "express";
import { ExpenseTracker } from "../expense/expense-tracker";
import { expenseDto, ExpenseDto } from "../expense/dto/expense-dto";
import { ZodError } from "zod";
import { UserManager } from "../user/user-manager";
import { userManager } from "./user.route";

export const expenseTracker = new ExpenseTracker();

export const canCreateExpense = (data: unknown): boolean => {
    const newExpenseDto = expenseDto.parse(data);
    if (!userManager.userExists(newExpenseDto.creditorId)) {
        return false;
    }
    if (!newExpenseDto.debtors.every(e => userManager.userExists(e.debtorId))) {
        return false;
    }
    return true;
}

export const createExpense = (body: unknown): Expense => {
    const newExpenseDto = expenseDto.parse(body);
    const newExpense = expenseTracker.add(newExpenseDto);
    return newExpense;
}

export const app = Router();

app.post("/", (req, res) => {
    try {
        const expense = createExpense(req.body);
        res.send(expense);
    } catch(e) {
        if (e instanceof ZodError) {
            res.status(400).send({message: e.errors});
            return;
        }
        res.status(500).send();
    }
})