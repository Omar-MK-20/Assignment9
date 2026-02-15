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