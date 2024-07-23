import express from "express";
import {app as userRoutes} from "./modules/route/user.route";
import {app as expenseRoutes} from "./modules/route/expense.route";

export const app = express();

app.use(express.json());

app.use("/users", userRoutes);
app.use("/expenses", expenseRoutes);
app.use((req, res, next) => {
    res.status(404).send({message: "Not found"});
});

