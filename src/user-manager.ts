import { UserDto } from "./dto/userDto";

export class UserManager {
    private users: User[];
    private lastId: number;
    constructor() {
        this.users = [];
        this.lastId = 0;
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
}