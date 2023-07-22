import CustomError from "../helpers/error/CustomError.js";
import asyncErrorWrapper from "../helpers/error/asyncErrorWrapper.js";
import Question from "../models/Question.js";

const getAllQuestions = asyncErrorWrapper(async (req, res, next) => {
    const questions = await Question.find();
    res
        .status(200)
        .json({
            success: true,
            data: questions
        })
})

const getSingleQuestion = asyncErrorWrapper(async (req, res, next) => {
    const { id } = req.params;
    const question = await Question.findById(id);
    res.status(200).json({
        success: true,
        data: question
    })
})

const askNewQuestion = asyncErrorWrapper(async (req, res, next) => {
    const information = req.body;
    const question = await Question.create({
        ...information,
        user: req.user.id
    })

    res.status(200).json({
        success: true,
        data: question
    })

})

const editQuestion = asyncErrorWrapper(async (req, res, next) => {
    const id = req.params.id;
    const { title, content } = req.body;
    //title ve content bilgilerini aldık istersek information vs. diye bir değişken oluşturup tümünü de alabilirdik
    const question = await Question.findById(id);

    question.title = title;
    question.content = content;
    //kayıt edip yeni kaydı döndük
    const questionUpdate = await question.save();

    res.status(200).json({
        success: true,
        data: questionUpdate
    })
})

const deleteQuestion = asyncErrorWrapper(async (req, res, next) => {
    const { id } = req.params;
    await Question.findByIdAndDelete(id);

    res.status(200).json({
        success: true,
        message: "Question delete successful"
    })
})

const likeQuestion = asyncErrorWrapper(async (req, res, next) => {
    const { id } = req.params

    const question = await Question.findById(id);

    if (question.likes.includes(req.user.id)) {
        return next(new CustomError("This user question already liked", 400))
    }

    question.likes.push(req.user.id);
    await question.save();

    res.status(200).json({
        success: true,
        data: question

    })
})

const undoLike = asyncErrorWrapper(async (req, res, next) => {
    const { id } = req.params
    const question = await Question.findById(id);

    if (!question.likes.includes(req.user.id)) {
        return next(new CustomError("This user has already not liked the question",400))
    }

    let index = question.likes.indexOf(id); //kullanıcı indexini bul
    question.likes.splice(index,1); //sadece o indexi sil 

    await question.save(); //ve kaydet

    res.json({
        success:true,
        data: question
    })
})

const QuestionController = { getAllQuestions, askNewQuestion, getSingleQuestion, editQuestion, deleteQuestion, likeQuestion, undoLike };

export default QuestionController;