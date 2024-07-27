import { InMemoryDatabase } from "../database/in-memory-database";
import { IMyDatabase } from "../database/my-database";
import { UserDto } from "./dto/user-dto";

export interface IUserRepository {
    add: (newUserDto: UserDto) => Promise<User>,
    userExists: (id: number) => Promise<boolean>,
    getUserById: (id: number) => Promise<User|undefined>,
    getUsers: () => Promise<User[]>,
}

export class UserRepository {
    private inMemoryDatabase: IMyDatabase<User>;
    constructor() {
        this.inMemoryDatabase = new InMemoryDatabase<User>();
    }

    add = async (newUserDto: UserDto): Promise<User> => {
        const newUser = await this.inMemoryDatabase.save(newUserDto);
        return newUser;
    }

    userExists = async (id: number): Promise<boolean> => {
        return await this.inMemoryDatabase.find(id) != undefined;
    }

    getUserById = async (id: number): Promise<User|undefined> => {
        return await this.inMemoryDatabase.find(id);
    }

    getUsers = async () => {
        return await this.inMemoryDatabase.findAll(e => typeof(e.id) == "number");
    }
}