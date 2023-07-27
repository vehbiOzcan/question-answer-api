import mongoose from "mongoose";
import slugify from "slugify";

const Schema = mongoose.Schema;

const QuestionSchema = new Schema({

    title: {
        type: String,
        required: [true, "Please provide a title"],
        minlength: [10, "Please provide a title 10 character"],
        unique: true
    },
    content: {
        type: String,
        required: [true, "Please provide a content"],
        minlength: [10, "Please provide a title 10 character"],
    },
    slug: String,
    createdAt: {
        type: Date,
        default: Date.now
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User"
    },
    likes:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'User'
        },
    ],
    answers:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Answer"
        }
    ]

});
//Sorumuza kayır olmadan önce yani save edilmeden önce slug alanı ekliyoruz update işlemlerinde title güncellenmemişse slug alanı değişmez !
QuestionSchema.pre("save", function (next) {
    if(!this.isModified("title")){
        next();
    }
    this.slug = this.makeSlug();
    next();
})

//Question metotları içerisine slugify paketi ile gelen fonksiyonu kendi titleımızı verip configure ederke fonkisyonun sonucunu return ediyoruz 
QuestionSchema.methods.makeSlug = function () {
    return slugify(this.title, {
        replacement: '-',  // replace spaces with replacement character, defaults to `-`
        remove: /[*+~.()'"?!:@]/g , // remove characters that match regex, defaults to `undefined`
        lower: true,      // convert to lower case, defaults to `false`
        strict: false,     // strip special characters except replacement, defaults to `false`
        locale: 'vi',      // language code of the locale to use
        trim: true         // trim leading and trailing replacement chars, defaults to `true`})
    })
}

export default mongoose.model("Question", QuestionSchema);