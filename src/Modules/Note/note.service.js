import mongoose from "mongoose";
import { NoteModel } from "../../DB/Models/note.model.js";
import { UserModel } from "../../DB/Models/user.model.js";
import { verifyToken } from "../../util/EncryptData.js";
import { ResponseError } from "../../util/ResponseError.js";

export async function creteNote(headers, bodyData)
{
    const { token } = headers;
    const { payload } = verifyToken(token);

    const existUser = await UserModel.findById(payload.id);

    if (!existUser)
    {
        throw new ResponseError("user not found", 404, { id: payload.id });
    }

    const result = await NoteModel.create({ ...bodyData, userId: payload.id });

    return { message: "note created successfully", result };

}


export async function updateNote(headers, params, bodyData)
{
    const { noteId } = params;
    const { token } = headers;
    const { payload } = verifyToken(token);

    const existUser = await UserModel.findById(payload.id);
    if (!existUser)
    {
        throw new ResponseError("user not found", 404, { id: payload.id });
    }

    const existNote = await NoteModel.findById(noteId);
    if (!existNote)
    {
        throw new ResponseError("note not found", 404, { id: noteId });
    }

    if (existUser._id.toString() != existNote.userId.toString())
    {
        throw new ResponseError("you are not the owner", 403, { noteId: noteId, userId: payload.id });
    }

    const updatedData = [];

    if (bodyData.title && bodyData.title !== existNote.title)
    {
        existNote.title = bodyData.title;
        updatedData.push("title");
    }

    if (bodyData.content && bodyData.content !== existNote.content)
    {
        existNote.content = bodyData.content;
        updatedData.push("content");
    }

    if (updatedData.length) await existNote.save();

    return updatedData.length
        ? { message: `Note ${updatedData.join(", ")} updated successfully`, note: existNote }
        : { message: `Data didn't change`, note: existNote };
}


export async function updateAllTitles(headers, bodyData)
{
    const { token } = headers;
    const { payload } = verifyToken(token);

    const existUser = await UserModel.findById(payload.id);
    if (!existUser)
    {
        throw new ResponseError("user not found", 404, { id: payload.id });
    }


}





export async function paginateSort(headers, query)
{
    const { token } = headers;
    const { payload } = verifyToken(token);

    const page = parseInt(query.page) || 1;
    const limit = parseInt(query.limit) || 0;

    const skipped = (page - 1) * limit;

    const countAllNotes = await NoteModel.find({ userId: payload.id }).countDocuments();

    const filteredNotes = await NoteModel.find({ userId: payload.id }).skip(skipped).limit(limit);

    const pages = Math.ceil(countAllNotes / limit);

    return query.limit
        ? { message: "success", totalNotes: countAllNotes, totalPages: pages, count: filteredNotes.length, currentPage: page, notes: filteredNotes }
        : { message: "success", totalNotes: countAllNotes, notes: filteredNotes };
}