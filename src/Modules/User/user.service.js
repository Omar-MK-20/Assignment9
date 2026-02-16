import { UserModel } from "../../DB/Models/user.model.js";
import { encrypt, hashingPassword } from "../../util/EncryptData.js";
import { ResponseError } from "../../util/ResponseError.js";

export async function createUser(bodyData)
{

    console.log(bodyData);
    const { email } = bodyData;

    const existUser = await UserModel.findOne({ email: email });

    if (existUser)
    {
        throw new ResponseError("email already exist", 409, { email });
    }

    bodyData.password = hashingPassword(bodyData.password);
    console.log(bodyData);

    bodyData.phone = encrypt(value);
    console.log(bodyData);

    const result = await UserModel.create(bodyData);

    return { message: "user created successfully", result };
}


// export async function signIn(bodyData)
// {
//     const { email, password } = bodyData;
//     const existUser = UserModel.findOne({ email: email });

// }



export async function getAllUsers()
{
    const result = await UserModel.find();

    if (result.length == 0)
    {
        throw new ResponseError("no users found", 404, { result });
    }

    return { message: "success", users: result };
}