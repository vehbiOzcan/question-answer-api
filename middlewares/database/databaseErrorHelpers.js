import mongoose from "mongoose";
import CustomError from "../../helpers/error/CustomError.js";
import asyncErrorWrapper from "../../helpers/error/asyncErrorWrapper.js";
import User from "../../models/User.js";
import { objectIdCasting } from "./objectIdCasting.js";
import Question from "../../models/Question.js";
import Answer from "../../models/Answer.js";

//sorgu işlemlerinde sürekli id kontrolü yapmamak için merkezi bir id kontrol middleware ı oluşturduk
const checkExistUser = asyncErrorWrapper(async (req, res, next) => {
    const { id } = req.params;
    const castId = objectIdCasting(id);
    const user = await User.findById(castId);

    if (!user) {
        next(new CustomError("There is no such user with that id", 400))
    }
    //istersek bu şekilde bir daha sorhu yapmamak adına req üzerine herhangi bir isimle datalarımızı kayıt edebiliriz biz burada data olarak kayıt ettik
    req.data = user;
    next(); //sorun yoksa devam ettirdik
})

const checkQuestionExist = asyncErrorWrapper(async (req, res, next) => {
    const id = objectIdCasting(req.params.id || req.params.question_id); //gelen parametre id ile mi yoksa question_id ile mi geliyor kontrol
    const question = await Question.findById(id);

    if (!question) {
        next(new CustomError("There is no such question with that id", 400));
    }

    next();
})

const checkQuestionAndAnswerExist = asyncErrorWrapper(async (req,res,next) => {
    const question_id = objectIdCasting(req.params.question_id)
    const answer_id = objectIdCasting(req.params.answer_id)

    const answer = await Answer.findOne({
        _id:answer_id,
        question:question_id
    })

    if(!answer){
        return next(new CustomError("There is no answer with that id assocatied with qustion id",400))
    }

    next();
})


export { checkExistUser, checkQuestionExist, checkQuestionAndAnswerExist };