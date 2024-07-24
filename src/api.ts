import express, { ErrorRequestHandler } from "express";
import {makeUserRouter} from "./modules/route/user.route";
import {makeExpenseRouter} from "./modules/route/expense.route";
import { UserRepository } from "./modules/user/user.repository";
import { ExpenseRepository } from "./modules/expense/expense.repository";
import { ExpenseService } from "./modules/expense/expense.service";
import { UserService } from "./modules/user/user.service";
import { ZodError } from "zod";

const userManager = new UserRepository();
const userService = new UserService(userManager);
const expenseTracker = new ExpenseRepository();
const expenseService = new ExpenseService(expenseTracker, userService);

export const app = express();

app.use(express.json());

app.use("/users", makeUserRouter(userService));
app.use("/expenses", makeExpenseRouter(expenseService));

const errorHandler: ErrorRequestHandler = (error, req, res, next) => {
    if (error instanceof ZodError) {
        res.status(400).send({message: error.errors});
    }
};
app.use(errorHandler);
app.use((req, res, next) => {
    res.status(404).send({message: "Not found"});
});

