import express  from "express";
import QuestionController from "../controllers/question.js";
import { getAccessToRoute } from "../middlewares/auth/auth.js";

const question = express.Router();

question.get("/", QuestionController.getAllQuestions);
question.post("/ask",getAccessToRoute ,QuestionController.askNewQuestion);

export default question;