import express from 'express'
import UserController from '../controllers/user.js';
import { checkExistUser } from '../middlewares/database/databaseErrorHelpers.js';
import { getAccessToRoute } from '../middlewares/auth/auth.js';
import { userQueryMiddleware } from '../middlewares/query/userQueryMiddleware.js';
import User from '../models/User.js';

const user = express.Router();

user.get("/", userQueryMiddleware(User), UserController.getAllUsers);
user.get("/:id", checkExistUser, UserController.getSingleUser);
user.put("/", getAccessToRoute, UserController.editDetails);

export default user;