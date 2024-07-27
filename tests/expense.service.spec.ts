import { ExpenseDto } from "../src/modules/expense/dto/expense-dto";
import { ExpenseRepository } from "../src/modules/expense/expense.repository";
import { ExpenseService } from "../src/modules/expense/expense.service"
import { Group } from "../src/modules/group/group";
import { GroupRepository } from "../src/modules/group/group.repository";
import { GroupService } from "../src/modules/group/group.service";
import { UserRepository } from "../src/modules/user/user.repository";
import { UserService } from "../src/modules/user/user.service";
import { NotFoundError, ValidationError } from "../src/utilities/http-error";

describe("expense service", () => {
    let expenseService: ExpenseService;
    let user1: User;
    let user2: User;
    let user3: User;
    let group: Group;
    let expenses: Expense[];
    beforeEach(async () => {
        const userService = new UserService(new UserRepository());
        const groupService = new GroupService(new GroupRepository(), userService);
        expenseService = new ExpenseService(new ExpenseRepository(), userService, groupService);
        user1 = await userService.createUser({name: "ali"});
        user2 = await userService.createUser({name: "reza"});
        user3 = await userService.createUser({name: "mohammad"});
        group = await groupService.createGroup({name: "g1", members: [user1.id, user2.id, user3.id]});
        const d1 = {creditorId: 1, groupId: group.id, description: "d1", debtors: [{debtorId: 2, amount: 50000}]};
        const d2 = {creditorId: 2, groupId: group.id, description: "d1", debtors: [{debtorId: 1, amount: 40000}]}
        const d3 = {creditorId: 2, groupId: group.id, description: "d1", debtors: [{debtorId: 3, amount: 40000}]}
        const d4 = {creditorId: 3, groupId: group.id, description: "d1", debtors: [{debtorId: 2, amount: 4000}, {debtorId: 1, amount: 10000}]}
        const e1 = await expenseService.createExpense(d1);
        const e2 = await expenseService.createExpense(d2);
        const e3 = await expenseService.createExpense(d3);
        const e4 = await expenseService.createExpense(d4);
        expenses = [e1, e3, e4];
    });

    describe("create", () => {
        it("should create new expense", async() => {
            const dto: ExpenseDto = {creditorId: user1.id, groupId: 1, description: "d1", debtors: [{debtorId: user2.id, amount: 3000}]}
            const createdExpense = await expenseService.createExpense(dto);
            expect(createdExpense.debtors).toBe(dto.debtors);
        });
    });

    describe("can create expense", () => {
        it("should return true if expense is valid", async () => {
            const dto: ExpenseDto = {creditorId: user1.id, groupId: 1, description: "d1", debtors: [{amount: 5000, debtorId: user2.id}]};
            expect(await expenseService.validateExpense(dto)).toBe(true);
        });

        it.skip("should return false if creditor id does not exist", () => {
            const dto: ExpenseDto = {creditorId: 10, groupId: 1, description: "d1", debtors: [{amount: 5000, debtorId: user2.id}]};
            expect(() => expenseService.validateExpense(dto)).toThrowError(NotFoundError);
        });

        it.skip("should return false if debtor id does not exist", () => {
            const dto: ExpenseDto = {creditorId: user1.id, groupId: 1, description: "d1", debtors: [{amount: 5000, debtorId: 10}]};
            expect(() => expenseService.validateExpense(dto)).toThrowError(NotFoundError);
        });

        it.skip("should throw error if debtors field is empty.", () => {
            const dto = {creditorId: user1.id, groupId: 1, description: "d1", debtors: []};
            expect(() => expenseService.validateExpense(dto)).toThrowError(ValidationError);
        });

        it.skip("should throw error if one of debtors have the same id as the creditor.", () => {
            const dto = {creditorId: user1.id, groupId: 1, description: "d1", debtors: [{debtorId: user1.id, amount: 1000}]};
            expect(() => expenseService.validateExpense(dto)).toThrowError(ValidationError);
        });
    });

    describe("calculate optimum expenses", () => {
        it("should return true transactions.", () => {
            const expectedTransactions: Transaction[] = [
                {giverId: 2, takerId: 1, amount: 14000},
                {giverId: 3, takerId: 1, amount: 26000}
            ];
            expect(expenseService.calculateOptimumTransactions(expenses, [1, 2, 3])).toStrictEqual(expectedTransactions);
        });
    });

    describe("get group even", () => {
        it("should return true transactions", async () => {
            expect(await expenseService.getGroupEvenTransactions(group.id)).toStrictEqual([{giverId: 3, takerId: 2, amount: 26000}]);
        })
    })
});