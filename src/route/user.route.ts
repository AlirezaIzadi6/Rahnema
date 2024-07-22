import {Router} from "express";
import { userDto, UserDto } from "../dto/userDto";
import { ZodError } from "zod";

export const users: User[] = [];

export const createUser = (body: unknown) => {
    const newUserDto = userDto.parse(body);
    const newUser = {
        id: users.length,
        name: newUserDto.name
    };
    users.push(newUser);
    return newUser;
}

export const app = Router();

app.post("/", (req, res) => {
    try {
        const user = createUser(req.body);
        res.status(200).send(user);
    } catch(e) {
        if (e instanceof ZodError) {
            res.status(400).send({message: e.errors});
        }
        res.status(500).send();
    }
});

app.get("/", (req, res) => {
    res.send(users);
});

