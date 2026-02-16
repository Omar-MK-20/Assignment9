import mongoose from "mongoose";
import bcrypt from "bcrypt";
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
        set: function (value)
        {
            try
            {
                const saltRounds = 12;
                const hash = bcrypt.hashSync(value, saltRounds);
                return hash;
            }
            catch (error)
            {
                throw new ResponseError("error hashing user's password", 500, { password: value });
            }
        }
    },
    phone: {
        type: Number,
        required: true,
        set: function ()
        {
            
        }
    },
    age: {
        type: Number,
        min: 18,
        max: 60,
    }
});


export const UserModel = mongoose.model("users", UserSchema);