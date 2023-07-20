import asyncErrorWrapper from "../helpers/error/asyncErrorWrapper.js";
import Question from "../models/Question.js";

const getAllQuestions = asyncErrorWrapper(async(req, res, next) => {
    const questions = await Question.find();
    res
        .status(200)
        .json({
            success:true,
            data:questions
        })
})

const getSingleQuestion = asyncErrorWrapper(async (req,res,next) => {
    const {id} = req.params;
    const question = await Question.findById(id);
    res.status(200).json({
        success:true,
        data:question
    })
})

const askNewQuestion = asyncErrorWrapper(async (req,res,next) => {
    const information = req.body;
    const question = await Question.create({
        ...information,
        user:req.user.id
    })

    res.status(200).json({
        success:true,
        data:question
    })

})

const QuestionController = {getAllQuestions,askNewQuestion,getSingleQuestion};

export default QuestionController;