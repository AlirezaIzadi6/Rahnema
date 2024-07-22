import {z} from "zod";

export const userDto = z.object({
    name: z.string().nonempty(),
});

export type UserDto = z.infer<typeof userDto>;

