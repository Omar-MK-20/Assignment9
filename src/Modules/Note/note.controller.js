import { Router } from "express";
import { creteNote, replaceNote, updateAllTitles, paginateSort, updateNote, deleteNote, getSingleNote } from "./note.service.js";

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


// 5. Delete a single Note

noteRouter.delete("/:noteId", async (req, res) =>
{
    const result = await deleteNote(req.headers, req.params);

    res.status(200).json(result);
});


// 6. Retrieve a paginated list of notes
noteRouter.get("/paginate-sort", async (req, res) =>
{

    const result = await paginateSort(req.headers, req.query);

    res.status(200).json(result);
});

noteRouter.get("/:id", async (req, res) =>
{
    const result = await getSingleNote(req.headers, req.params);

    res.status(200).json(result);
});