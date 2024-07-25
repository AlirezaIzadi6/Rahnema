import {z} from "zod";

export const groupDto = z.object({
    name: z.string().nonempty(),
    members: z.array(z.number()),
});

export type GroupDto = z.infer<typeof groupDto>;