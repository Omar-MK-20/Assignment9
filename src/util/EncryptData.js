import crypto from "node:crypto";
import { Buffer } from "node:buffer";
import { SECRET_KEY } from "../../config/app.config.js";
import bcrypt from "bcrypt";
import { ResponseError } from "./ResponseError.js";
import jwt from "jsonwebtoken";


const algorithm = "aes-256-gcm";
const key = Buffer.from(SECRET_KEY, "hex");
if (key.length !== 32)
{
    throw new Error("SECRET_KEY must be 32 bytes (64 hex characters)");
}

/**
 * A function that takes the data wanted to encrypted and encrypt it using `aes-256-gcm` algorithm
 * @param {string} data The data wanted to be encrypted
 * @returns {string} The encrypted data as string
 */
export function encrypt(data)
{
    try
    {
        const iv = crypto.randomBytes(12);
        const cipher = crypto.createCipheriv(algorithm, key, iv);

        let encryptedData = cipher.update(data, "utf-8", "hex");

        encryptedData += cipher.final("hex");

        const authTag = cipher.getAuthTag();

        return [encryptedData, iv.toString("hex"), authTag.toString("hex")].join(":");
    }
    catch (error)
    {
        throw new ResponseError("error encrypting user's phone", 500, { error });
    }
}

/**
 * A function that restores the data before encryption
 * @param {string} data The encrypted data wanted to be decrypted
 * @returns {string} The original data before encryption
 */
export function decrypt(data)
{
    try
    {
        const [encryptedData, iv, authTag] = data.split(":");

        const decipher = crypto.createDecipheriv(algorithm, key, Buffer.from(iv, "hex"));

        decipher.setAuthTag(Buffer.from(authTag, "hex"));

        let decryptedData = decipher.update(encryptedData, "hex", "utf-8");
        decryptedData += decipher.final("utf-8");

        return decryptedData;
    }
    catch (error)
    {
        throw new ResponseError("error decrypting user's phone", 500, { error });
    }
}



/**
 * 
 * @param {string} password 
 * @returns {Promise<string>}
 */
export async function hashingPassword(password)
{
    try
    {
        const saltRounds = 12;
        const hash = await bcrypt.hash(password, saltRounds);
        return hash;
    }
    catch (error)
    {
        throw new ResponseError("error hashing user's password", 500, { error });
    }
}

/**
 * 
 * @param {string | Buffer} password 
 * @param {string} hashedPassword 
 * @returns {Promise<boolean>}
 */
export async function compareHashes(password, hashedPassword)
{
    try
    {
        return await bcrypt.compare(password, hashedPassword);
    }
    catch (error)
    {
        throw new ResponseError("Password comparison failed", 500, { error });
    }
}

// const hashedPassword = await hashingPassword("password");

// console.log(await compareHashes("password", hashedPassword));

/**
 * 
 * @param { {id: string, name: string, email: string}} UserData
 * @returns {string} 
 */
export function tokenGenerator(UserData)
{
    // const data = { id, name, email };

    const expiresIn = "1hr";

    const token = jwt.sign(UserData, key, { expiresIn: expiresIn });

    return token;
}


/**
 * 
 * @param {string} token The JsonWebToken string
 * @returns {{header: { alg: string, typ: string }, payload: {id: string, name: string, email: string, iat: string, exp: string}, signature: string} | null}
 */
export function checkToken(token)
{
    try
    {
        const data = jwt.verify(token, key, { complete: true });
        return data;
    }
    catch (error)
    {
        // console.log({ error });
        if (error.name === "TokenExpiredError")
        {
            throw new ResponseError("token expired, login again", 401, { error });
        }
        else if (error.name === "JsonWebTokenError")
        {
            throw new ResponseError("invalid token", 401, { error });
        }
        throw new ResponseError("token not active", 401, { error });
    }
}


// const token = tokenGenerator({ id: 1234, name: "omar", email: "omar@email.com" });
// console.log(token);

// const data = checkToken(token);
// console.log(data);
