import {Router} from "express";
import { userDto, UserDto } from "../user/dto/user-dto";
import { ZodError } from "zod";
import { UserManager } from "../user/user-manager";
import { UserService } from "../user/user.service";

export const makeUserRouter = (userService: UserService) => {
    const app = Router();

    app.get("/:id", (req, res) => {
        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            res.status(400).send({message: "Id must be number."});
            return;
        }
        if (!userService.userExists(id)) {
            res.status(404).send({message: "User not found."});
            return;
        }
        res.send(userService.getUserById(id));
    });
    
    app.post("/", (req, res) => {
        try {
            const user = userService.createUser(req.body);
            res.status(200).send(user);
        } catch(e) {
            if (e instanceof ZodError) {
                res.status(400).send({message: e.errors});
            }
            res.status(500).send();
        }
    });

    app.get("/", (req, res) => {
        res.send(userService.getUsers());
    });
    return app;
}
