import request from "supertest";
import { app } from "../src/api";
import { isUserArray } from "./utilities";

describe("user", () => {
    describe("create", () => {
        it("should create user", async() => {
            const {body: user} = await request(app)
            .post("/users")
            .send({name: "ali"})
            .expect(200);
        });

        it("should fail if name is not provided.", async() => {
            await request(app)
            .post("/users")
            .send({name: ""})
            .expect(400);
        });
    });

    describe("creation", () => {
        it("should return created users", async() => {
            const {body: createdUser} = await request(app)
            .post("/users")
            .send({name: "ali"})
            .expect(200);

            const {body: users} = await request(app)
            .get("/users")
            .send()
            .expect(200);

            expect(isUserArray(users)).toBe(true);
            if (isUserArray(users)) {
                expect(users.at(-1)?.name).toBe("ali")
            }
        })
    })
})