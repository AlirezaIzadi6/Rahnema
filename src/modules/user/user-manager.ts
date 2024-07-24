import { UserDto } from "./dto/user-dto";

export class UserManager {
    private users: User[];
    private lastId: number;
    constructor() {
        this.users = [];
        this.lastId = 1;
    }

    add = (newUserDto: UserDto): User|undefined => {
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