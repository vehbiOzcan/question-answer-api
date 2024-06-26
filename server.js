import express from 'express'
import dotenv from 'dotenv'
import routers from './routers/index.js';
import { connectDatabase } from './helpers/database/connectDatabase.js';
import ErrorHandler from './middlewares/error/ErrorHandler.js';
import {fileURLToPath} from 'url';
import path, { dirname } from 'path';

//app'i başlattık
const app = express();

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)


//Json middleware ni kullandık
app.use(express.json())

//Enviroment Variables
dotenv.config(
    {
        path: "./config/env/config.env" //dotenv config içerisine config dosyamızın path ini verdik
    })

app.use(express.static(path.join(__dirname,'public')))
    
const PORT = process.env.PORT;

//Connection Database
connectDatabase();


//Router Middleware
app.use("/api", routers);


//Error Handler Middleware (Routerlardan sonra yazılmalıdır)
app.use(ErrorHandler.customErrorHandler);

app.listen(PORT, () => console.log(`App started on ${PORT} number : ${process.env.NODE_ENV}`));