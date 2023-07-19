import express from 'express'
import UserController from '../controllers/user.js';
import { checkExistUser } from '../middlewares/database/databaseErrorHelpers.js';
import { getAccessToRoute } from '../middlewares/auth/auth.js';

const user = express.Router();

user.get("/",UserController.getAllUsers);
user.get("/:id",checkExistUser,UserController.getSingleUser);
user.put("/",getAccessToRoute,UserController.editDetails);

export default user;