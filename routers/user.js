import express from 'express'
import UserController from '../controllers/user.js';
import { checkExistUser } from '../middlewares/database/databaseErrorHelpers.js';

const user = express.Router();

user.get("/",UserController.getAllUsers);
user.get("/:id",checkExistUser,UserController.getSingleUser);

export default user;