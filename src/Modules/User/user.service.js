import { UserModel } from "../../DB/Models/user.model.js";
import { checkToken, compareHashes, encrypt, hashingPassword, tokenGenerator } from "../../util/EncryptData.js";
import { ResponseError } from "../../util/ResponseError.js";

export async function createUser(bodyData)
{
    const { email } = bodyData;

    const existUser = await UserModel.findOne({ email: email });

    if (existUser)
    {
        throw new ResponseError("email already exist", 409, { email });
    }

    bodyData.password = await hashingPassword(bodyData.password);

    bodyData.phone = encrypt(bodyData.phone);

    const { password, ...result } = (await UserModel.create(bodyData)).toObject();

    return { message: "user created successfully", result };
}


export async function login(bodyData)
{
    // const { email, password } = bodyData;

    const existUser = await UserModel.findOne({ email: bodyData.email }).select('+password');


    const isPasswordCorrect = await compareHashes(bodyData.password, existUser.password);

    if (!existUser || !isPasswordCorrect)
    {
        throw new ResponseError("invalid email or password", 401, { email: bodyData.email, password: bodyData.password });
    }

    let { password, ...userData } = existUser.toObject();

    userData.token = tokenGenerator({ name: userData.name, email: userData.email, id: userData.id });


    return { message: "login successful", user: userData };

}


export async function updateUser(headers, bodyData)
{
    const { token } = headers;

    const { payload } = checkToken(token);

    const existUser = await UserModel.findById(payload.id);
    // console.log(existUser);

    if (!existUser)
    {
        throw new ResponseError("user not found", 404, { id: payload.id });
    }

    // console.log(bodyData.email && bodyData.email !== existUser.email);
    if (bodyData.email && bodyData.email !== existUser.email)
    {
        const existEmail = await UserModel.findOne({ email: bodyData.email, _id: { $ne: payload.id } });
        console.log(existEmail);
    }

    return { message: "updated" };
}



export async function getAllUsers()
{
    const result = await UserModel.find();

    if (result.length == 0)
    {
        throw new ResponseError("no users found", 404, { result });
    }

    return { message: "success", users: result };
}