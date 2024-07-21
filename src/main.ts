import express from "express";

export const app = express();

app.use(express.json());

app.use((req, res, next) => {
    res.status(404).send({message: "Not found"});
});

app.listen(3000, () => {
    console.log("Listening on port 3000...");
});