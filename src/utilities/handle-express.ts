import { Response } from "express";
import { ZodError } from "zod";
import { HttpError } from "./http-error";

export const handleExpress = async <T>(res: Response, fn: () => T|Promise<T>) => {
    try {
        const data = await fn();
        res.status(200).send(data);
    } catch(e) {
        if (e instanceof ZodError) {
            res.status(400).send({message: e.errors});
            return;
        } else if (e instanceof HttpError) {
            res.status(e.status).send({message: e.message});
            return;
        }
        res.status(500).send();
    }
}