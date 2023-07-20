import express  from "express";
import QuestionController from "../controllers/question.js";
import { getAccessToRoute } from "../middlewares/auth/auth.js";
import { checkQuestionExist } from "../middlewares/database/databaseErrorHelpers.js";

const question = express.Router();

question.get("/", QuestionController.getAllQuestions);
question.get("/:id",checkQuestionExist,QuestionController.getSingleQuestion)
question.post("/ask",getAccessToRoute ,QuestionController.askNewQuestion);

export default question;