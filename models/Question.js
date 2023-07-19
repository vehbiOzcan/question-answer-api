import mongoose from "mongoose";

const Schema  = mongoose.Schema;

const QuestionSchema = new Schema({

    title:{
        type:String,
        required: [true,"Please provide a title"],
        minlength: [10,"Please provide a title 10 character"],
        unique:true
    },
    content:{
        type:String,
        required: [true,"Please provide a content"],
        minlength: [10,"Please provide a title 10 character"],
    },
    slug:String,
    createdAt:{
        type:Date,
        default:Date.now
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:"User"
    }

});

export default mongoose.model("Question",QuestionSchema);