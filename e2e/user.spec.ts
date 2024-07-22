import request from "supertest";
import { app } from "../src/api";

describe("user", () => {
    describe("create", () => {
        it("should create user", async() => {
            const {body: user} = await request(app)
            .post("/users")
            .send({name: "ali"})
            .expect(200);
        })
    })
})