import express  from "express";
//Controllers
import AuthController from "../controllers/auth.js";

const auth = express.Router();

auth.post("/register",AuthController.register)
auth.get("/error",AuthController.errorTest)


export default auth;