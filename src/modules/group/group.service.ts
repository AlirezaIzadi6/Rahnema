import { NotFoundError, ValidationError } from "../../utilities/http-error";
import { UserService } from "../user/user.service";
import { GroupDto, GroupId } from "./dto/group-dto";
import { Group } from "./group";
import { GroupRepository } from "./group.repository";

export interface IGroupService {
    validateGroup: (newGroupDto: GroupDto) => boolean,
    createGroup: (newGroupDto: GroupDto) => Promise<Group>,
    getGroupsByMemberId: (memberId: number) => Group[],
    getGroup: (id: number) => Group,
}

export class GroupService implements IGroupService {
    constructor(private groupRepository: GroupRepository, private userService: UserService) {}

    validateGroup = (newGroupDto: GroupDto) => {
        if (newGroupDto.members.length == 0) {
            throw new ValidationError("Members field is empty");
        } else if (!newGroupDto.members.every(m => this.userService.userExists(m))) {
            throw new ValidationError("member does not exist.");
        }
        return true;
    }

    createGroup = async (newGroupDto: GroupDto) => {
        this.validateGroup(newGroupDto);
        const newGroup = this.groupRepository.add(newGroupDto);
        return newGroup;
    }

    getGroupsByMemberId = (memberId: number) => {
        return this.groupRepository.getGroupsByMemberId(memberId);
    }

    getGroup = (id: number) => {
        const group = this.groupRepository.getGroup(id);
        if (!group) {
            throw new NotFoundError("Group not found");
        }
        return group;
    }

    groupExists = (id: number): boolean => {
        return this.groupRepository.groupExists(id);
    }
}