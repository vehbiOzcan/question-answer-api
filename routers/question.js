import express  from "express";
import QuestionController from "../controllers/question.js";

const question = express.Router();

question.get("/", QuestionController.getAllQuestions);

export default question;