import mongoose from "mongoose";
import Question from "./Question.js";

const Schema = mongoose.Schema;

const AnswerSchema = new Schema({
    content: {
        type: String,
        required: [true, "Please provide a content"],
        minlength: [10, "Please provide a content at least 10 character"]
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    likes: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    ],
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    question: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Question",
        required: true
    }
})

//Bir soru eklediğimizde ilgili questionın answers dizisine de o answerin id sini ekliyoruz
AnswerSchema.pre("save", async function (next) {
    if (!this.isModified("user")) return next();
    
    try {
        //pre hookunu kullandığımız için this nesnemiz içnde question alanı var ve bu da bizim sorumuzun id sini tutuyoruz
        const question = await Question.findById(this.question) //question ObjectId tipinde ve ilgili sorunun id sine sahip
        question.answers.push(this._id);
        question.answersCount = question.answers.length //Cevap eklediğimizde answerCount umuzu arttırdık 
        await question.save();
        next();
    } catch (error) {
        return next(error)
    }
})

export default mongoose.model("Answer", AnswerSchema);