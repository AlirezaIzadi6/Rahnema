import request from "supertest";
import {app} from "../src/api";
import { isExpense, makeExpense, makeGroup, makeUser } from "./utilities";
import { Group } from "../src/modules/group/group";

describe("expense", () => {
    let group: Group;
    let user1: User;
    let user2: User;
    let user3: User;
    let expenses: Expense[] = [];
    beforeAll(async () => {
        user1 = makeUser((await request(app)
        .post("/users")
        .send({name: "ali"})
        .expect(200)).body)
        user2 = makeUser((await request(app)
        .post("/users")
        .send({name: "reza"})
        .expect(200)).body)
        user3 = makeUser((await request(app)
        .post("/users")
        .send({name: "mohammad"})
        .expect(200)).body)
        group = makeGroup((await request(app)
        .post("/groups")
        .send({name: "g1", members: [user1.id, user2.id, user3.id]})
        .expect(200)).body);
        const d1 = {creditorId: 1, groupId: group.id, description: "d1", debtors: [{debtorId: 2, amount: 50000}]};
        const d2 = {creditorId: 2, groupId: group.id, description: "d1", debtors: [{debtorId: 1, amount: 40000}]}
        const d3 = {creditorId: 2, groupId: group.id, description: "d1", debtors: [{debtorId: 3, amount: 40000}]}
        const d4 = {creditorId: 3, groupId: group.id, description: "d1", debtors: [{debtorId: 2, amount: 4000}, {debtorId: 1, amount: 10000}]}
        const e1 = makeExpense((await request(app)
        .post("/expenses")
        .send(d1)
        .expect(200)).body);
        const e2 = makeExpense((await request(app)
        .post("/expenses")
        .send(d2)
        .expect(200)).body);
        const e3 = makeExpense((await request(app)
        .post("/expenses")
        .send(d3)
        .expect(200)).body);
        const e4 = makeExpense((await request(app)
        .post("/expenses")
        .send(d4)
        .expect(200)).body);
        expenses = [e1, e2, e3, e4];
    });

    describe("create", () => {
        it("should create a new expense", async() => {
            const {body: expense} = await request(app)
            .post("/expenses")
            .send({creditorId: user1.id, groupId: group.id, description: "testy", debtors: [{debtorId: user2.id, amount: 1000}]})
            .expect(200);

            expect(isExpense(expense)).toBe(true);
        });

        it("should not create if debtors field is missing.", async() => {
            await request(app)
            .post("/expenses")
            .send({creditorId: user1.id, groupId: group.id, description: "testy", debtors: []})
            .expect(400);
        });
    });

    describe("get group even", () => {
        it("should return one expense for group", async() => {
            const {body: result} = await request(app)
            .get(`/expenses/get-group-even/${group.id}`)
            .send()
            .expect(200);
        });
    });
});