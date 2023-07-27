import CustomError from "../helpers/error/CustomError.js";
import asyncErrorWrapper from "../helpers/error/asyncErrorWrapper.js";
import Answer from "../models/Answer.js";
import Question from "../models/Question.js";

const addNewAnswerToQuestion = asyncErrorWrapper(async (req, res, next) => {
    const { question_id } = req.params;
    const user_id = req.user.id;
    const information = req.body

    const answer = await Answer.create({
        ...information,
        question: question_id,
        user: user_id
    })

    return res.status(200).json({
        success: true,
        data: answer
    })
})

const getQuestionAllAnswers = asyncErrorWrapper(async (req, res, next) => {
    const { question_id } = req.params;

    //question modeli içinde oluşturduğumuz answer alanı ve içerisindeki ref:"Answer" modeline verdğimiz referans sayesinde 
    //populate metodunu kullanarak id lerine göre ilgili soruya ait tüm cevapların bütün özelliklerini getirdik
    const question = await Question.findById(question_id).populate("answers");

    const answers = question.answers;
    return res.status(200).json({
        success: true,
        count: answers.length,
        data: answers
    })
})

const getSingleAnswer = asyncErrorWrapper(async (req, res, next) => {
    const answer_id = req.params?.answer_id;

    const answer = await Answer.findById(answer_id)
        .populate({
            path: "question",
            select: "title"
        })
        .populate({
            path: "user",
            select: "name profil_image"
        })
    //populate kısmını bu şekilde özelleştirebiliriz model üzerinde referans verdiğimiz ilgili alanları path:"alan"
    //gelmesini istediğimiz alanları ise select:"alan1 alan2 vs..." şeklinde verebiliriz
    // .populate("question")
    // .populate("user");

    return res.status(200).json({
        success: true,
        data: answer
    })
})

const editAnswer = asyncErrorWrapper(async (req, res, next) => {
    const answer_id = req.params.answer_id;
    const { content } = req.body;
    let answer = await Answer.findById(answer_id);

    answer.content = content;
    answer = await answer.save();

    res.status(200).json({
        success: true,
        data: answer
    })
})

const deleteAnswer = asyncErrorWrapper(async (req, res, next) => {
    const { answer_id } = req.params
    const { question_id } = req.params

    await Answer.findByIdAndRemove(answer_id);

    const question = await Question.findById(question_id);

    question.answers.splice(question.answers.indexOf(answer_id), 1);
    await question.save();
    return res.status(200).json({
        success: true,
        message: "Delete answer successfull"
    })
})

const likeAnswer = asyncErrorWrapper(async (req, res, next) => {
    const { answer_id } = req.params
    const user_id = req.user.id
    const answer = await Answer.findById(answer_id);

    if (answer.likes.includes(user_id)){
        return next(new CustomError("You already liked this answer", 400));
    }

    answer.likes.push(user_id);
    await answer.save();
    res.status(200).json({
        success:true,
        count:answer.likes.length,
        data:answer

    })
})



const undoLikeAnswer = asyncErrorWrapper(async (req, res, next) => {
    const { answer_id } = req.params
    const user_id = req.user.id
    const answer = await Answer.findById(answer_id);

    if (!answer.likes.includes(user_id)){
        return next(new CustomError("You already not liked this answer", 400));
    }

    answer.likes.splice(answer.likes.indexOf(user_id),1);
    await answer.save();
    res.status(200).json({
        success:true,
        count:answer.likes.length,
        data:answer

    })
})

const AnswerController = { addNewAnswerToQuestion, getQuestionAllAnswers, getSingleAnswer, editAnswer, deleteAnswer, likeAnswer, undoLikeAnswer }
export default AnswerController;