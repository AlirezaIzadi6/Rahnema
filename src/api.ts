import express, { ErrorRequestHandler } from "express";
import {makeUserRouter} from "./modules/route/user.route";
import {makeExpenseRouter} from "./modules/route/expense.route";
import { UserRepository } from "./modules/user/user.repository";
import { ExpenseRepository } from "./modules/expense/expense.repository";
import { ExpenseService } from "./modules/expense/expense.service";
import { UserService } from "./modules/user/user.service";
import { ZodError } from "zod";
import { GroupRepository } from "./modules/group/group.repository";
import { GroupService } from "./modules/group/group.service";
import { makeGroupRouter } from "./modules/route/group.route";

const userRepository = new UserRepository();
const userService = new UserService(userRepository);

const groupRepository = new GroupRepository();
const groupService = new GroupService(groupRepository, userService);

const expenseTracker = new ExpenseRepository();
const expenseService = new ExpenseService(expenseTracker, userService, groupService);

export const app = express();

app.use(express.json());

app.use("/users", makeUserRouter(userService));
app.use("/expenses", makeExpenseRouter(expenseService));
app.use("/groups", makeGroupRouter(groupService));

const errorHandler: ErrorRequestHandler = (error, req, res, next) => {
    if (error instanceof ZodError) {
        res.status(400).send({message: error.errors});
    }
};
app.use(errorHandler);
app.use((req, res, next) => {
    res.status(404).send({message: "Not found"});
});

