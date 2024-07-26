import { ExpenseDto } from "../src/modules/expense/dto/expense-dto";
import { ExpenseRepository } from "../src/modules/expense/expense.repository";
import { ExpenseService } from "../src/modules/expense/expense.service"
import { UserRepository } from "../src/modules/user/user.repository";
import { UserService } from "../src/modules/user/user.service";
import { NotFoundError, ValidationError } from "../src/utilities/http-error";

describe("expense service", () => {
    let expenseService: ExpenseService;
    let user1: User;
    let user2: User;
    beforeEach(async () => {
        const userService = new UserService(new UserRepository());
        user1 = await userService.createUser({name: "ali"});
        user2 = await userService.createUser({name: "reza"});
        expenseService = new ExpenseService(new ExpenseRepository(), userService);
    });

    describe("create", () => {
        it("should create new expense", async() => {
            const dto: ExpenseDto = {creditorId: user1.id, description: "d1", debtors: [{debtorId: user2.id, amount: 3000}]}
            const createdExpense = await expenseService.createExpense(dto);
            expect(createdExpense.debtors).toBe(dto.debtors);
        });
    });

    describe("can create expense", () => {
        it("should return true if expense is valid", () => {
            const dto: ExpenseDto = {creditorId: user1.id, description: "d1", debtors: [{amount: 5000, debtorId: user2.id}]};
            expect(expenseService.validateExpense(dto)).toBe(true);
        });

        it("should return false if creditor id does not exist", () => {
            const dto: ExpenseDto = {creditorId: 10, description: "d1", debtors: [{amount: 5000, debtorId: user2.id}]};
            expect(() => expenseService.validateExpense(dto)).toThrowError(NotFoundError);
        });

        it("should return false if debtor id does not exist", () => {
            const dto: ExpenseDto = {creditorId: user1.id, description: "d1", debtors: [{amount: 5000, debtorId: 10}]};
            expect(() => expenseService.validateExpense(dto)).toThrowError(NotFoundError);
        });

        it("should throw error if debtors field is empty.", () => {
            const dto = {creditorId: user1.id, description: "d1", debtors: []};
            expect(() => expenseService.validateExpense(dto)).toThrowError(ValidationError);
        });

        it("should throw error if one of debtors have the same id as the creditor.", () => {
            const dto = {creditorId: user1.id, description: "d1", debtors: [{debtorId: user1.id, amount: 1000}]};
            expect(() => expenseService.validateExpense(dto)).toThrowError(ValidationError);
        });
    });
});