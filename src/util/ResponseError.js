export class ResponseError extends Error
{
    /**
     * @param {string} message 
     * @param {number} status Default `500`
     * @param {object} info Additional information about the cause of the error
     */
    constructor(message, statusCode = 500, info = null)
    {
        super(message);
        this.name = 'ResponseError';
        this.statusCode = statusCode;
        this.info = info;

        Error.captureStackTrace(this, this.constructor);
    }
}