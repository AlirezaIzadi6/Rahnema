import request from "supertest";
import {app} from "../src/api";
import { isExpense, makeGroup, makeUser } from "./utilities";
import { Group } from "../src/modules/group/group";

describe("expense", () => {
    let group: Group;
    let user1: User;
    let user2: User;
    beforeAll(async () => {
        user1 = makeUser(await request(app)
        .post("/users")
        .send({name: "ali"})
        .expect(200))
        user2 = makeUser(await request(app)
        .post("/users")
        .send({name: "reza"})
        .expect(200))
        group = makeGroup(await request(app)
        .post("/groups")
        .send({name: "g1", members: [user1.id, user2.id]})
        .expect(200));
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
            .send({creditorId: user1.id, groupId: 433, description: "testy", debtors: [{debtorId: user2.id, amount: 1000}]})
            .expect(400);
        });
    });
});