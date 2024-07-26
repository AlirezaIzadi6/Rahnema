import request from "supertest";
import { app } from "../src/api";
import { GroupRepository } from "../src/modules/group/group.repository";

describe("group", () => {
    describe("create", () => {
        it("should create group", async() => {
            const {body: user} = await request(app)
            .post("/users")
            .send({name: "ali"})
            .expect(200);

            const {body: createdGroup} = await request(app)
            .post("/groups")
            .send({name: "g1", members: [1]})
            .expect(200);
        });

        it("should fail if member id doesn't exist.", async() => {
            await request(app)
            .post("/groups")
            .send({name: "g2", members: [1, 4000]})
            .expect(400);
        });

        it("should fail if name is not provided.", async() => {
            await request(app)
            .post("/groups")
            .send({name: "", members: [1]})
            .expect(400);
        });

        it("should fail if members field is missing", async() => {
            await request(app)
            .post("/groups")
            .send({name: "g3"})
            .expect(400);
        })
    });

    describe("get by id", () => {
        it("should fail if id is not number", async() => {
            await request(app)
            .get("/groups/d")
            .send()
            .expect(400);
        });

        it("should fail if group not found", async() => {
            await request(app)
            .get("/groups/3020")
            .send()
            .expect(404);
        });

        it("should find group", async() => {
            const {body: group} = await request(app)
            .get("/groups/1")
            .send()
            .expect(200);
            expect(group.id).toBe(1)
        });
    });

});