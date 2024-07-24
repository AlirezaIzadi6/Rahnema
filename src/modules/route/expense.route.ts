import {Router} from "express";
import { ZodError } from "zod";
import { UserRepository } from "../user/user.repository";
import { ExpenseService } from "../expense/expense.service";
import { ExpenseRepository } from "../expense/expense.repository";
import { expenseDto } from "../expense/dto/expense-dto";
import { HttpError } from "../../utilities/http-error.ts";
import { handleExpress } from "../../utilities/handle-express";

export const makeExpenseRouter = (expenseService: ExpenseService) => {
    const app = Router();

    app.post("/", (req, res) => {
        const newExpenseDto = expenseDto.parse(req.body);
        handleExpress(res, () => expenseService.createExpense(newExpenseDto));
    })
    return app;
}