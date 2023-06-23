import express from 'express'
import question from './question.js';
import auth from './auth.js';

const routers = express.Router();

routers.use("/questions",question);
routers.use("/auth", auth);

export default routers; 