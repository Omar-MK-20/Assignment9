import express from 'express';
import { SEVER_PORT } from '../config/app.config.js';
import { testDBConnection } from './DB/Connection.js';
import { errorMiddleware } from './util/ErrorMiddleware.js';
import { notFoundRoute } from './util/NotFoundRoute.js';
import { userRouter } from './Modules/User/user.controller.js';



export async function bootstrap()
{

    await testDBConnection();

    const server = express();


    server.use(express.json());

    server.use("/users", userRouter);

    server.use(errorMiddleware);

    server.use(notFoundRoute);

    server.listen(SEVER_PORT, () =>
    {
        console.log(`Server is running on port :: ${SEVER_PORT}`);
    });

}