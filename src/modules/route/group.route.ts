import {Router} from "express";
import { GroupService } from "../group/group.service";
import { groupDto, groupId } from "../group/dto/group-dto";
import { handleExpress } from "../../utilities/handle-express";

export const app = Router();

export const makeGroupRouter= (groupService: GroupService) => {
    app.post("/", (req, res) => {
        const newGroupDto = groupDto.parse(req.body);
        handleExpress(res, () => groupService.createGroup(newGroupDto));
    });

    app.get("/:id", (req, res) => {
        const id = groupId.parse(req.params.id);
        handleExpress(res, () => groupService.getGroup(id));
    });

    return app;
}