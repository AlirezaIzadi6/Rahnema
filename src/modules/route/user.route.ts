import {Router} from "express";
import { userDto, UserDto } from "../user/dto/user-dto";
import { ZodError } from "zod";
import { UserRepository } from "../user/user.repository";
import { UserService } from "../user/user.service";
import { handleExpress } from "../../utilities/handle-express";

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
        const newUserDto = userDto.parse(req.body);
        handleExpress(res, () => userService.createUser(newUserDto));
    });

    app.get("/", async (req, res) => {
        res.send(await userService.getUsers());
    });
    return app;
}
