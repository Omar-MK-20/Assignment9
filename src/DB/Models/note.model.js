import mongoose from "mongoose";

const NoteSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        validate: {
            validator: function (value)
            {
                return value !== value.toUpperCase();
            },
            message: value => `${value} can't be entirely uppercase`
        }
    },
    content: {
        type: String,
        required: true
    },
    userId: {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: "users",
    }
}, {
    timestamps: true,
});


export const NoteModel = mongoose.model("notes", NoteSchema);