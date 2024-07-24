import {Router} from "express";
import { ZodError } from "zod";
import { UserManager } from "../user/user-manager";
import { ExpenseService } from "../expense/expense.service";
import { ExpenseTracker } from "../expense/expense-tracker";
import { expenseDto } from "../expense/dto/expense-dto";
import { HttpError } from "../../utilities/not-found-error";
import { handleExpress } from "../../utilities/handle-express";

export const makeExpenseRouter = (expenseService: ExpenseService) => {
    const app = Router();

    app.post("/", (req, res) => {
        const newExpenseDto = expenseDto.parse(req.body);
        handleExpress(res, () => expenseService.createExpense(newExpenseDto));
    })
    return app;
}