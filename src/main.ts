import express from "express";
import {app as userRoutes} from "./route/user.route";

export const app = express();

app.use(express.json());

app.use("/users", userRoutes);
app.use((req, res, next) => {
    res.status(404).send({message: "Not found"});
});

app.listen(3000, () => {
    console.log("Listening on port 3000...");
});