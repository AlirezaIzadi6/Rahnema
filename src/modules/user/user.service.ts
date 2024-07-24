import { userDto, UserDto } from "./dto/user-dto";
import { UserRepository } from "./user.repository";

export interface IUserService {
    createUser: (newUserDto: UserDto) => Promise<User>,
    getUserById: (id: number) => User|undefined,
    getUsers: () => User[],
    userExists: (id: number) => boolean,
}

export class UserService implements IUserService {
    constructor(private userManager: UserRepository) {}

    createUser = async (newUserDto: UserDto): Promise<User> => {
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