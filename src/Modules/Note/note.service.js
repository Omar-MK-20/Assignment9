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


export async function replaceNote(headers, params, bodyData)
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

    if (!bodyData.title || !bodyData.content)
    {
        throw new ResponseError("title and content are required", 422, { data: bodyData });
    }

    existNote.title = bodyData.title;
    existNote.content = bodyData.content;
    await existNote.save();

    return { message: "note updated", result: existNote };
}



export async function updateAllTitles(headers, bodyData)
{
    const { token } = headers;
    const { payload } = verifyToken(token);

    console.log({ payload });
    const existUser = await UserModel.findById(payload.id);
    if (!existUser)
    {
        throw new ResponseError("user not found", 404, { id: payload.id });
    }

    if (!bodyData.title)
    {
        throw new ResponseError("title is required", 422, { title: bodyData.title });
    }


    const result = await NoteModel.updateMany({ userId: payload.id }, { title: bodyData.title });
    if (!result.matchedCount)
    {
        throw new ResponseError("not notes found", 404, { userId: payload.id });
    }


    return { message: "all notes updated", result };
}


export async function deleteNote(headers, params)
{
    const { token } = headers;
    const { payload } = verifyToken(token);
    const { noteId } = params;

    const existUser = await UserModel.findById(payload.id);
    if (!existUser)
    {
        throw new ResponseError("user not found", 404, { userId: payload.id });
    }

    const existNote = await NoteModel.findById(noteId);
    if (!existNote)
    {
        throw new ResponseError("note not found", 404, { noteId: noteId });
    }

    const result = await NoteModel.deleteOne({ _id: existNote.id, userId: existUser.id });

    if (!result.deletedCount)
    {
        throw new ResponseError("you are not the owner", 401, { userId: existUser.id });
    }

    return { message: "note deleted successfully", result };


}


export async function paginateSort(headers, query)
{
    const { token } = headers;
    const { payload } = verifyToken(token);

    const page = parseInt(query.page) || 1;
    const limit = parseInt(query.limit) || 0;

    const skipped = (page - 1) * limit;

    const countAllNotes = await NoteModel.find({ userId: payload.id }).countDocuments();

    const filteredNotes = await NoteModel.find({ userId: payload.id }).skip(skipped).limit(limit).sort({ createdAt: "desc" });

    const pages = Math.ceil(countAllNotes / limit);

    return query.limit
        ? { message: "success", totalNotes: countAllNotes, totalPages: pages, count: filteredNotes.length, currentPage: page, notes: filteredNotes }
        : { message: "success", totalNotes: countAllNotes, notes: filteredNotes };
}


export async function getSingleNote(headers, params)
{
    const { token } = headers;
    const { payload } = verifyToken(token);
    const { id } = params;

    const existUser = await UserModel.findById(payload.id);
    if (!existUser)
    {
        throw new ResponseError("user not found", 404, { userId: payload.id });
    }

    const existNote = await NoteModel.findById(id);
    if (!existNote)
    {
        throw new ResponseError("note not found", 404, { noteId: id });
    }

    const result = await NoteModel.findOne({ _id: existNote._id, userId: existUser._id });
    if (!result)
    {
        throw new ResponseError("you are not the owner", 401, { userId: payload.id });
    }

    return { message: "success", note: result };

}


export async function getByContent(headers, query)
{
    const { token } = headers;
    const { payload } = verifyToken(token);
    const content = query.content || "";

    const existUser = await UserModel.findById(payload.id);
    if (!existUser)
    {
        throw new ResponseError("user not found", 404, { userId: payload.id });
    }

    const notes = await NoteModel.find({ userId: payload.id, content: { $regex: content, $options: "i" } });

    return { message: "success", notes };
}


export async function getWithUser(headers)
{
    const { token } = headers;
    const { payload } = verifyToken(token);

    const existUser = await UserModel.findById(payload.id);
    if (!existUser)
    {
        throw new ResponseError("user not found", 404, { userId: payload.id });
    }

    const notesWithUser = await NoteModel
        .find({ userId: payload.id })
        .select("title")
        .populate("userId", "-_id email")
        .lean();

    return { message: "success", notes: notesWithUser };
}




export async function getWithAggregate(headers, query)
{
    const { token } = headers;
    const { payload } = verifyToken(token);
    const title = query.title || "";

    const existUser = await UserModel.findById(payload.id);
    if (!existUser)
    {
        throw new ResponseError("user not found", 404, { userId: payload.id });
    }

    const result = await NoteModel.aggregate([
        {
            $match: {
                userId: new mongoose.Types.ObjectId(payload.id),
                title: { $regex: title, $options: "i" }
            }
        },
        { $lookup: { from: "users", foreignField: "_id", localField: "userId", as: "user" } },
        { $unwind: "$user" },
        {
            $project: {
                _id: 0,
                title: 1,
                userId: 1,
                createdAt: 1,
                "user.name": 1,
                "user.email": 1
            }
        },
    ])
        ;
    return { message: "success", notes: result };
}



export async function deleteAllNotes(headers)
{
    const { token } = headers;
    const { payload } = verifyToken(token);

    const existUser = await UserModel.findById(payload.id);
    if (!existUser)
    {
        throw new ResponseError("user not found", 404, { userId: payload.id });
    }

    const result = await NoteModel.deleteMany({ userId: payload.id });

    if (!result.deletedCount)
    {
        throw new ResponseError("no notes found", 404, { userId: payload.id });
    }

    return { message: "notes deleted successfully", result };
}