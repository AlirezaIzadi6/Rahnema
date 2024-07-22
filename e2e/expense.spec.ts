import request from "supertest";
import {app} from "../src/api";
import { isExpense } from "./utilities";

describe("expense", () => {
    describe("create", () => {
        it("should create a new expense", async() => {
            const {body: expense} = await request(app)
            .post("/expenses")
            .send({creditorId: 1, description: "testy", debtors: []})
            .expect(200);

            expect(isExpense(expense)).toBe(true);
        });

        it("should not create if debtors field is missing.", async() => {
            await request(app)
            .post("/expenses")
            .send({creditorId: 1, description: "testy"})
            .expect(400);
        });
    });
});