import {Router} from "express";
import { ExpenseTracker } from "../expense-tracker";
import { ExpenseDto } from "../dto/expenseDto";

export const expenseTracker = new ExpenseTracker();

export const createExpense = (expenseDto: ExpenseDto) => {
    
}
export const app = Router();

