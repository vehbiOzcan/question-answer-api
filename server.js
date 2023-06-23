import express from 'express'
import dotenv from 'dotenv'
import routers from './routers/index.js';
import { connectDatabase } from './helpers/database/connectDatabase.js';
import ErrorHandler from './middlewares/error/ErrorHandler.js';

//app'i başlattık
const app = express();

//Enviroment Variables
dotenv.config(
    {
        path: "./config/env/config.env" //dotenv config içerisine config dosyamızın path ini verdik
    })

const PORT = process.env.PORT;

//Connection Database
connectDatabase();


//Router Middleware
app.use("/api", routers);


//Error Handler Middleware (Routerlardan sonra yazılmalıdır)
app.use(ErrorHandler.customErrorHandler);

app.listen(PORT, () => console.log(`App started on ${PORT} number : ${process.env.NODE_ENV}`));