import { Router } from "express";
import { creteNote, replaceNote, updateAllTitles, paginateSort, updateNote } from "./note.service.js";

export const noteRouter = Router();


// 1. Create single Note
noteRouter.post("/", async (req, res) =>
{
    const result = await creteNote(req.headers, req.body);

    res.status(200).json(result);
});


// 4. Updates title for all notes
noteRouter.patch("/all", async (req, res) =>
{
    const result = await updateAllTitles(req.headers, req.body);

    res.status(200).json(result);

});

// 2. Update single Note
noteRouter.patch("/:noteId", async (req, res) =>
{
    const result = await updateNote(req.headers, req.params, req.body);

    res.status(200).json(result);
});


// 3. Replace the entire note document

noteRouter.put("/replace/:noteId", async (req, res) =>
{
    const result = await replaceNote(req.headers, req.params, req.body);

    res.status(200).json(result);
});



noteRouter.get("/paginate-sort", async (req, res) =>
{

    const result = await paginateSort(req.headers, req.query);

    res.status(200).json(result);
});