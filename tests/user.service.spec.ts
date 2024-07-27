    import { ExpenseService } from "../src/modules/expense/expense.service";
import { UserRepository } from "../src/modules/user/user.repository";
import { UserService, } from "../src/modules/user/user.service";

describe("user", () => {
    const userService = new UserService(new UserRepository());
    describe("create", () => {
        it("should return new user", async () => {
            const userDto = {
                name: "ali"
            };
            const user = {id: 1, name: "ali"};
            expect(await userService.createUser(userDto)).toStrictEqual(user);
        });
    });

    describe("getUser", () => {
        it("should find created user by id", async() => {
            const userDto = {"name": "Reza"};
            const createdUser = await userService.createUser(userDto);
            expect((await userService.getUserById(createdUser.id))?.name).toBe(createdUser.name);
        });

        it.skip("should return undefined if user does not exist", async () => {
            expect(await userService.getUserById(100022)).toBe(undefined);
        });
    });

    describe("get users", () => {
        it("should return all users", async () => {
            const preLength = (await userService.getUsers()).length;
            await userService.createUser({name: "mahdi"});
            const postLength = (await userService.getUsers()).length;
            expect(postLength).toBe(preLength+1);
        });
    });

    describe("user exists", () => {
        it("should return true if created user exists.", async() => {
            const userDto = {name: "jamal"};
            const createdUser = await userService.createUser(userDto);
            expect(await userService.userExists(createdUser.id)).toBe(true);
        });

        it("should return false if user doesn't exist", async () => {
            expect(await userService.userExists(100022)).toBe(false);
        })
    });
});