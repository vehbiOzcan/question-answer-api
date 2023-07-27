import express from "express";
import AnswerController from "../controllers/answer.js";
import { getAccessToRoute, getAnswerOwnerAccess } from "../middlewares/auth/auth.js";
import { checkQuestionAndAnswerExist, checkQuestionExist } from "../middlewares/database/databaseErrorHelpers.js";

const answer = express.Router({mergeParams:true}); 
//biz question routerından answer routena yönlendiriliyoruz yani bir alt routera geçtiğimiz için üstten gelen 
//parametreler default olarak aktarılmaz eğer biz aktarılmasını istiyorsak yukarıda ki şekilde yani Router({mergeParams:true})
//yapmamız gerekir 
// /:question_id/answers
answer.post("/",getAccessToRoute,AnswerController.addNewAnswerToQuestion);
answer.get("/",AnswerController.getQuestionAllAnswers);
answer.get("/:answer_id",checkQuestionAndAnswerExist,AnswerController.getSingleAnswer);
answer.get("/:answer_id/like",[checkQuestionAndAnswerExist,getAccessToRoute],AnswerController.likeAnswer);
answer.get("/:answer_id/undo_like",[checkQuestionAndAnswerExist,getAccessToRoute],AnswerController.undoLikeAnswer);
answer.put("/:answer_id/edit",[checkQuestionAndAnswerExist,getAccessToRoute,getAnswerOwnerAccess],AnswerController.editAnswer);
answer.delete("/:answer_id/delete",[checkQuestionAndAnswerExist,getAccessToRoute,getAnswerOwnerAccess],AnswerController.deleteAnswer);
export default answer;