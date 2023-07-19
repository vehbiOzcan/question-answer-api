import express from 'express'
import question from './question.js';
import auth from './auth.js';
import user from './user.js';
import admin from './admin.js';

const routers = express.Router();

routers.use("/questions",question);
routers.use("/auth", auth);
routers.use("/user",user);
routers.use("/admin",admin);

export default routers; 