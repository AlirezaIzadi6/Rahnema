import {z} from "zod";

export const groupDto = z.object({
    name: z.string().nonempty(),
    members: z.array(z.number()),
});

export const groupId = z.coerce.number();

export type GroupDto = z.infer<typeof groupDto>;
export type GroupId = z.infer<typeof groupId>;