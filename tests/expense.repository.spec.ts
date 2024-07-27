import { ExpenseDto, ExpenseItemDto } from "../src/modules/expense/dto/expense-dto";
import { ExpenseRepository } from "../src/modules/expense/expense.repository"

describe("expense repository", () => {
    const expenseRepository = new ExpenseRepository();

    describe("add", () => {
        it("should create expense", async () => {
            const expenseDto = {creditorId: 1, groupId: 1, description: "test", debtors: []};
            const expense = await expenseRepository.add(expenseDto);
            expect(expense.description).toBe("test");
        });
    });

    describe("expense exists", () => {
        it("should return true if expense exists", async () => {
            const expenseDto = {creditorId: 1, groupId: 1, description: "test", debtors: []};
            const createdExpense = await expenseRepository.add(expenseDto);
            expect(await expenseRepository.expenseExists(createdExpense.id)).toBe(true);
        });
    });
});