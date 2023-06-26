import mongoose from "mongoose";
import bcrypt from 'bcryptjs';
//Mongoose içerisinden Schema objesini aldık
const { Schema } = mongoose;

//Schema objesinden yeni bir UserSchema objesi ürettik
const UserSchema = new Schema({

    name: {
        type: String,
        required: [true, "Please provide a name"]
    },
    email: {
        type: String,
        required: true,
        unique: [true, "Please different email"],
        match: [/^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/, "Please provide a valid email"]

    },
    role: {
        type: String,
        default: "user",
        enum: ["user", "admin"],
    },
    password: {
        type: String,
        minlength: [6, "Please provide a password with min length 6"],
        required: [true, "Please provide a password"],
        selected: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    title: {
        type: String
    },
    about: {
        type: String
    },
    place: {
        type: String
    },
    website: {
        type: String
    },
    profil_image: {
        type: String,
        default: "default.jpg"
    },
    blocked: {
        type: Boolean,
        default: false
    }
})

//Mongoose un Pre and Post hook ları sayesinde belirtilen  db işleminden önce ve sonra yapıla-cak/bilecek işlemleri yaparız.
UserSchema.pre("save", function (next) {
    //Parola Değişmemişse
    if(!this.isModified("password")){
        next();
    }

    bcrypt.genSalt(10, (err, salt) => {
        if(err) next(err); //Hata varsa customHandlerımıza gönderdik
        //hash(gönderdiğimizString, salt, (errorDeğişkeni, hashlenmişHaliniTutanDeğişken) )
        bcrypt.hash(this.password, salt, (err, hash) => {
            if(err) next(err); //hata varsa handlerımıza gönderdik
            this.password = hash; // hashlenmiş parolayı eskisi ile değiştirdik
            next();
        });
    });
    //console.log(this,"Pre Hooks : Save");
});

//Mongoose içerisine modelimizi kayıt ettik ve export ettik
export default mongoose.model("User", UserSchema);
