import { Router } from "express";
import { createUser } from "./user.service.js";

export const userRouter = Router();

userRouter.post("/signup", async (req, res) =>
{
    const result = await createUser(req.body);
    res.status(200).json(result);
});