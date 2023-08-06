import CustomError from "../helpers/error/CustomError.js";
import asyncErrorWrapper from "../helpers/error/asyncErrorWrapper.js";
import Question from "../models/Question.js";

const getAllQuestions = asyncErrorWrapper(async (req, res, next) => {

    let populate = true;
    //Sorular ile beraber kullanıcıların bazı bilgilerini almak için puplate i kullandık
    const populateObject = {
        path: "user",
        select: "name profil_image"
    }
    //SEARCH
    let queryC = Question.find(); //Bunu yapmamızın nedeni sorgu filterisinden hemen sonra sayıyı almamız 
    let query = Question.find(); //Burada verileri çekmedik sadece query'i Question.find olarak ayarladık 
    //query parametresi olarak search olarak gönderiyoruz ve souları filtrelemeyi sağlıyoruz 
    if (req.query.search) {
        const searchObject = {};
        const regex = new RegExp(req.query.search, 'i'); //Regex'i istediğimiz flag ile oluşturuyoruz biz burada i flagini yaniküçük büyük harf duyarsızlaştırdık
        searchObject['title'] = regex; //oluşturduğumuz objemizin içine title a göre filitre yapacağımız için regexi ekledik

        query = query.where(searchObject);
        queryC = queryC.where(searchObject);
    }

    //POPULATE
    if (populate) {
        query = query.populate(populateObject);
    }

    //PAGINATION
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;

    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    const pagination = {};

    //1 2 3 4 5 6  7 8 9 10  -> 10 tane soru var
    //page = 2  limit = 5   startIndex = 5  5. indexten başlayacak bir öncesinde 0 dan 4. ye kadar gelmişti
    //skip(startIndex) kaç tane atlanacağını söyledik aslında nereden başlanacağı gibi düşünülebilir
    //limit(limit) kaç tane alıncağını söyledik
    
    const total = await queryC.countDocuments();

    query = query.skip(startIndex).limit(limit);

    //Eğer startIndex yani başlnagıç indexi 0 dan büyükse o zaman bir önceki sayfa vardır ve ekleriz 
    if (startIndex > 0) {
        pagination.previous = {
            page: page - 1,
            limit: limit
        }
    }
    //Eğer endIndex total (tüm soru sayısı) den küçükse bir sonraki sayfa vardır ve ekleriz 
    if (endIndex < total) {
        pagination.next = {
            page: page + 1,
            limit: limit
        }
    }

    const questions = await query;

    res
        .status(200)
        .json({
            success: true,
            count: questions.length,
            currentPage: page, 
            totalPage: Math.ceil(total / limit),
            pagination: pagination,
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
    question.likesCount = question.likes.length
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
        return next(new CustomError("This user has already not liked the question", 400))
    }

    let index = question.likes.indexOf(id); //kullanıcı indexini bul
    question.likes.splice(index, 1); //sadece o indexi sil 
    question.likesCount = question.likes.length;

    await question.save(); //ve kaydet

    res.json({
        success: true,
        data: question
    })
})

const QuestionController = { getAllQuestions, askNewQuestion, getSingleQuestion, editQuestion, deleteQuestion, likeQuestion, undoLike };

export default QuestionController;