import { UserDto } from "./dto/user-dto";

export interface IUserRepository {
    add: (newUserDto: UserDto) => User,
    userExists: (id: number) => boolean,
    getUserById: (id: number) => User|undefined,
    getUsers: () => User[],
}

export class UserRepository {
    private users: User[];
    private lastId: number;
    constructor() {
        this.users = [];
        this.lastId = 1;
    }

    add = (newUserDto: UserDto): User => {
        const newUser = {
            id: this.lastId,
            name: newUserDto.name
        };
        this.users.push(newUser);
        this.lastId++;
        return newUser;
    }

    userExists = (id: number): boolean => {
        return this.users.find(u => u.id === id) != undefined
    }

    getUserById = (id: number): User|undefined => {
        return this.users.find(u => u.id == id);
    }
    
    getUsers = () => {
        return this.users;
    }
}