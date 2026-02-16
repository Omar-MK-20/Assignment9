import { UserModel } from "../../DB/Models/user.model.js";
import { ResponseError } from "../../util/ResponseError.js";

export async function createUser(bodyData)
{
    const { email } = bodyData;

    const existUser = await UserModel.findOne({ email: email });

    if (existUser)
    {
        throw new ResponseError("email already exist", 409, { email });
    }

    const result = await UserModel.create(bodyData);

    return { message: "user created successfully", result };
}


export async function getAllUsers()
{
    const result = await UserModel.find();

    if (!result)
    {
        throw new ResponseError("no users found", 404, { result });
    }

    return { message: "success", users: result };
}