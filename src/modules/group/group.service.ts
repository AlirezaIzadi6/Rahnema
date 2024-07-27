import { asyncEvery } from "../../utilities/async-every";
import { NotFoundError, ValidationError } from "../../utilities/http-error";
import { UserService } from "../user/user.service";
import { GroupDto, GroupId } from "./dto/group-dto";
import { Group } from "./group";
import { GroupRepository } from "./group.repository";

export interface IGroupService {
    validateGroup: (newGroupDto: GroupDto) => Promise<boolean>,
    createGroup: (newGroupDto: GroupDto) => Promise<Group>,
    getGroupsByMemberId: (memberId: number) => Promise<Group[]>,
    getGroup: (id: number) => Promise<Group>,
}

export class GroupService implements IGroupService {
    constructor(private groupRepository: GroupRepository, private userService: UserService) {}

    validateGroup = async (newGroupDto: GroupDto) => {
        if (newGroupDto.members.length == 0) {
            throw new ValidationError("Members field is empty");
        } else if (!(await asyncEvery(newGroupDto.members, async(m) => await this.userService.userExists(m)))) {
            throw new ValidationError("member does not exist.");
        }
        return true;
    }

    createGroup = async (newGroupDto: GroupDto) => {
        await this.validateGroup(newGroupDto);
        const newGroup = await this.groupRepository.add(newGroupDto);
        return newGroup;
    }

    getGroupsByMemberId = async (memberId: number) => {
        return await this.groupRepository.getGroupsByMemberId(memberId);
    }

    getGroup = async (id: number) => {
        const group = await this.groupRepository.getGroup(id);
        if (!group) {
            throw new NotFoundError("Group not found");
        }
        return group;
    }

    groupExists = async(id: number): Promise<boolean> => {
        return await this.groupRepository.groupExists(id);
    }
}