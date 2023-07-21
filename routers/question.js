import express  from "express";
import QuestionController from "../controllers/question.js";
import { getAccessToRoute, getQuestionOwnerAccess } from "../middlewares/auth/auth.js";
import { checkExistUser, checkQuestionExist} from "../middlewares/database/databaseErrorHelpers.js";

const question = express.Router();

question.get("/", QuestionController.getAllQuestions);
question.get("/:id",checkQuestionExist,QuestionController.getSingleQuestion);
question.post("/ask",getAccessToRoute ,QuestionController.askNewQuestion);
question.put("/:id/edit",[getAccessToRoute,checkQuestionExist,getQuestionOwnerAccess],QuestionController.editQuestion);
question.delete("/:id/delete",[getAccessToRoute,checkQuestionExist,getQuestionOwnerAccess],QuestionController.deleteQuestion);

export default question;