import mongoose from "mongoose";
import { decrypt } from "../../util/EncryptData.js";
import { ResponseError } from "../../util/ResponseError.js";

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
        select: false
    },
    phone: {
        type: String,
        required: true,
        get: function (value)
        {
            try
            {
                return decrypt(value);
            }
            catch (error)
            {
                throw new ResponseError("error decrypting user's phone", 500, { error });
            }
        },
    },
    age: {
        type: Number,
        min: 18,
        max: 60,
    }
}, {
    toJSON: { getters: true },
    toObject: { getters: true }
});

// UserSchema.post();


export const UserModel = mongoose.model("users", UserSchema);