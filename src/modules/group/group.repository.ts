import { InMemoryDatabase } from "../database/in-memory-database";
import { IMyDatabase } from "../database/my-database";
import { GroupDto } from "./dto/group-dto";
import { Group } from "./group";

export interface IGroupRepository {
    add: (newGroupDto: GroupDto) => Promise<Group>,
    groupExists: (id: number) => Promise<boolean>,
    getGroup: (id: number) => Promise<Group|undefined>,
    getGroupsByMemberId: (memberId: number) => Promise<Group[]>,
}

export class GroupRepository implements IGroupRepository {
    private inMemoryDatabase: IMyDatabase<Group>;
    constructor() {
        this.inMemoryDatabase = new InMemoryDatabase();
    }

    add = async (newGroupDto: GroupDto) => {
        const newGroup = await this.inMemoryDatabase.save(newGroupDto);
        return newGroup;
    }

    groupExists = async (id: number) => {
        return await this.inMemoryDatabase.find(id) != undefined;
    }

    getGroup = async (id: number) => {
        return await this.inMemoryDatabase.find(id);
    }

    getGroupsByMemberId = async (memberId: number) => {
        return await this.inMemoryDatabase.findAll(g => g.members.includes(memberId));
    }
}