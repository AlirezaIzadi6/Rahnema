import { ExpenseDto, ExpenseItemDto } from "../src/modules/expense/dto/expense-dto";
import { ExpenseRepository } from "../src/modules/expense/expense.repository"

describe("expense repository", () => {
    const expenseRepository = new ExpenseRepository();

    describe("add", () => {
        it("should create expense", () => {
            const expenseDto = {creditorId: 1, description: "test", debtors: []};
            const expense = expenseRepository.add(expenseDto);
            expect(expense.description).toBe("test");
        });
    });

    describe("expense exists", () => {
        it("should return true if expense exists", () => {
            const expenseDto = {creditorId: 1, description: "test", debtors: []};
            const createdExpense = expenseRepository.add(expenseDto);
            expect(expenseRepository.expenseExists(createdExpense.id)).toBe(true);
        });
    });

    describe("get creditor expenses", () => {
        it("should return creditor expenses", () => {
            const expenseDto1: ExpenseDto = {
                creditorId: 1,
                description: "test1",
                debtors: [
                    {debtorId: 2, amount: 25000},
                    {debtorId: 1, amount: 45000}
                ]
            };
            const expenseDto2: ExpenseDto = {
                creditorId: 2,
                description: "test1",
                debtors: [
                    {debtorId: 3, amount: 35000},
                    {debtorId: 3, amount: 5000},
                    {debtorId: 1, amount: 40000}
                ]
            };
            expenseRepository.add(expenseDto1);
            expenseRepository.add(expenseDto2);
            const expectedItems1: ExpenseItemDto[] = expenseDto1.debtors;
            const expectedItems2: ExpenseItemDto[] = expenseDto2.debtors;
            const expectedItems3: ExpenseItemDto[] = [];
            expect(expenseRepository.getCreditorExpenses(1)).toStrictEqual(expectedItems1);
            expect(expenseRepository.getCreditorExpenses(2)).toStrictEqual(expectedItems2);
            expect(expenseRepository.getCreditorExpenses(3)).toStrictEqual(expectedItems3);
        });
    });
});;