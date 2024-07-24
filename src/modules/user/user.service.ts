import { userDto, UserDto } from "./dto/user-dto";
import { UserManager } from "./user-manager";

export interface IUserService {
    createUser: (body: unknown) => User|undefined,
    getUserById: (id: number) => User|undefined,
    getUsers: () => User[],
    userExists: (id: number) => boolean,
}

export class UserService implements IUserService {
    constructor(private userManager: UserManager) {}

    createUser = (body: unknown): User|undefined => {
        const newUserDto = userDto.parse(body);
        const newUser = this.userManager.add(newUserDto);
        return newUser;
    }

    getUserById = (id: number): User|undefined => {
        return this.userManager.getUserById(id);
    }

    getUsers = (): User[] => {
        return this.userManager.getUsers();
    }

    userExists = (id: number): boolean => {
        return this.userManager.userExists(id);
    }
}