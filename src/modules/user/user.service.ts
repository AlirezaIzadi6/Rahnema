import { userDto, UserDto } from "./dto/user-dto";
import { UserRepository } from "./user.repository";

export interface IUserService {
    createUser: (newUserDto: UserDto) => Promise<User>,
    getUserById: (id: number) => Promise<User|undefined>,
    getUsers: () => Promise<User[]>,
    userExists: (id: number) => Promise<boolean>,
}

export class UserService implements IUserService {
    constructor(private userManager: UserRepository) {}

    createUser = async (newUserDto: UserDto): Promise<User> => {
        const newUser = await this.userManager.add(newUserDto);
        return newUser;
    }

    getUserById = async (id: number): Promise<User|undefined> => {
        return await this.userManager.getUserById(id);
    }

    getUsers = async (): Promise<User[]> => {
        return await this.userManager.getUsers();
    }

    userExists = async (id: number): Promise<boolean> => {
        return await this.userManager.userExists(id);
    }
}