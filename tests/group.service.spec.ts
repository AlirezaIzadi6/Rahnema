import { GroupDto } from "../src/modules/group/dto/group-dto";
import { Group } from "../src/modules/group/group";
import { GroupRepository } from "../src/modules/group/group.repository"
import { GroupService } from "../src/modules/group/group.service";
import { UserRepository } from "../src/modules/user/user.repository";
import { UserService } from "../src/modules/user/user.service";
import { NotFoundError, ValidationError } from "../src/utilities/http-error";

describe("group", () => {
    let userService: UserService;
    let groupService: GroupService;
    let user1: User;
    let user2: User;
    beforeEach(async() => {
        userService = new UserService(new UserRepository)
        groupService = new GroupService(new GroupRepository(), userService);
        user1 = await userService.createUser({name: "ali"});
        user2 = await userService.createUser({name: "reza"});
    });

    describe("validate", () => {
        it("should return true if group is valid", async() => {
            const groupDto: GroupDto = {name: "g1", members: [user1.id, user2.id]};
            expect(await groupService.validateGroup(groupDto)).toBe(true);
        });

        it.skip("should throw error if member doesn't exist", () => {
            expect(() => groupService.validateGroup({name: "g1", members: [40330]})).toThrowError(ValidationError);
        });

        it.skip("should throw error if members array is empty", () => {
            expect(() => groupService.validateGroup({name: "g1", members: []})).toThrowError(ValidationError);
        });
    });

    describe("create", () => {
        it("should create group", async() => {
            const newGroupDto: GroupDto = {name: "g1", members: [user1.id, user2.id]}
            expect((await groupService.createGroup(newGroupDto)).name).toBe(newGroupDto.name);
        });
    });

    describe("get", () => {
        it("should return group", async() => {
            const createdGroup: Group = await groupService.createGroup({name: "g1", members: [user1.id]});
            expect(await groupService.getGroup(createdGroup.id)).toBe(createdGroup);
        });

        it.skip("should throw error if group is not found.", () => {
            expect(() => groupService.getGroup(1)).toThrowError(NotFoundError);
        });
    });

    describe("get groups by member id", () => {
        it("should return member's groups", async() => {
            const dto1 = {name: "g1", members: [user1.id, user2.id]};
            const dto2 = {name: "g2", members: [user1.id]};
            const group1 = await groupService.createGroup(dto1);
            const group2 = await groupService.createGroup(dto2);
            expect(await groupService.getGroupsByMemberId(user1.id)).toStrictEqual([group1, group2]);
            expect(await groupService.getGroupsByMemberId(user2.id)).toStrictEqual([group1])
        });
    });
});