import { GroupDto } from "./dto/group-dto";
import { Group } from "./group";

export interface IGroupRepository {
    add: (newGroupDto: GroupDto) => Group,
    groupExists: (id: number) => boolean,
    getGroup: (id: number) => Group|undefined,
    getGroupsByMemberId: (memberId: number) => Group[],
}

export class GroupRepository implements IGroupRepository {
    private groups: Group[];
    private lastId: number;
    constructor() {
        this.groups = [];
        this.lastId = 1;
    }

    add = (newGroupDto: GroupDto) => {
        const newGroup: Group = {
            id: this.lastId,
            name: newGroupDto.name,
            members: newGroupDto.members,
        };
        this.groups.push(newGroup);
        this.lastId++;
        return newGroup;
    }

    groupExists = (id: number) => {
        return this.groups.find(g => g.id === id) != undefined;
    }

    getGroup = (id: number) => {
        return this.groups.find(g => g.id === id);
    }

    getGroupsByMemberId = (memberId: number) => {
        return this.groups.filter(g => g.members.includes(memberId));
    }
}