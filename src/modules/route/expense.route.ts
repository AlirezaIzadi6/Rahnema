import {Router} from "express";
import { ZodError } from "zod";
import { UserManager } from "../user/user-manager";
import { userManager } from "./user.route";
import { ExpenseService } from "../expense/expense.service";
import { ExpenseTracker } from "../expense/expense-tracker";

export const expenseService = new ExpenseService(new ExpenseTracker());
export const app = Router();

app.post("/", (req, res) => {
    try {
        const expense = expenseService.createExpense(req.body);
        res.send(expense);
    } catch(e) {
        if (e instanceof ZodError) {
            res.status(400).send({message: e.errors});
            return;
        }
        res.status(500).send();
    }
})