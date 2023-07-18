import express from 'express'
import UserController from '../controllers/user.js';

const user = express.Router();

user.get("/:id",UserController.getSingleUser);

export default user;