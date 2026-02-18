import { Router } from "express";
import { bulkCreate, createUser, deleteUser, getAllUsers, getSingleUser, login, updateUser } from "./user.service.js";

export const userRouter = Router();

userRouter.post("/signup", async (req, res) =>
{
    const result = await createUser(req.body);
    res.status(200).json(result);
});


userRouter.post("/login", async (req, res) =>
{
    const result = await login(req.body);
    res.status(200).json(result);
});


userRouter.patch("/", async (req, res) =>
{
    const result = await updateUser(req.headers, req.body);
    res.status(201).json(result);
});

userRouter.delete("/", async (req, res) =>
{
    const result = await deleteUser(req.headers);

    res.status(200).json(result);
});


userRouter.get("/", async (req, res) =>
{
    let result;
    if (req.headers.token)
    {
        result = await getSingleUser(req.headers);
    }
    else
    {
        result = await getAllUsers();
    }

    res.status(200).json(result);
});


userRouter.post("/bulk-create", async (req, res) =>
{
    const result = await bulkCreate(req.body);

    res.status(201).json(result);
});