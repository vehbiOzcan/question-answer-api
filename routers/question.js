import express from "express";
import QuestionController from "../controllers/question.js";
import { getAccessToRoute, getQuestionOwnerAccess } from "../middlewares/auth/auth.js";
import { checkExistUser, checkQuestionExist } from "../middlewares/database/databaseErrorHelpers.js";
import answer from "./answer.js";
import { questionQueryMiddleware } from "../middlewares/query/questionQueryMiddleware.js";
import Question from "../models/Question.js";
import { answerQueryMiddleware } from "../middlewares/query/answerQueryMiddleware.js";

const question = express.Router();

question.get("/", questionQueryMiddleware(Question,
    {
        population: {
            path: 'user',
            select: "name profil_image"
        }
    }
), QuestionController.getAllQuestions);
question.get("/:id", checkQuestionExist, answerQueryMiddleware(Question,
    {
        population: [
            { path: 'user', select: "name profil_image" },
            { path: 'answers', select: "content" }
        ]
    }
), QuestionController.getSingleQuestion);
question.get("/:id/like", [getAccessToRoute, checkQuestionExist], QuestionController.likeQuestion)
question.get("/:id/undo_like", [getAccessToRoute, checkQuestionExist], QuestionController.undoLike)
question.post("/ask", getAccessToRoute, QuestionController.askNewQuestion);
question.put("/:id/edit", [getAccessToRoute, checkQuestionExist, getQuestionOwnerAccess], QuestionController.editQuestion);
question.delete("/:id/delete", [getAccessToRoute, checkQuestionExist, getQuestionOwnerAccess], QuestionController.deleteQuestion);

//soru-cevap arasında güçlü bir ilişki olduğu için yönlendirilmesini soru üzerinden yaptık
question.use("/:question_id/answers", checkQuestionExist, answer);
export default question;