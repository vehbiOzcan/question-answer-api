import mongoose from "mongoose";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto'
import Question from "./Question.js";

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
        unique: true,
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
        select: false
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
    },
    resetPasswordToken: {
        type: String
    },
    resetPasswordExpire: {
        type: Date
    }
})

//UserSchema methods

UserSchema.methods.generateJwtFromUser = function () {
    //Secret key ve Expıred (jwt geçer süresini env dosyasından aldık)
    const { JWT_SECRET_KEY, JWT_EXPIRE } = process.env;

    const payload = { //Jwt sahibi hakkındaki bilgiler
        id: this._id, //kullanıcı id bilgisi
        name: this.name //kullanıcı isim bilgisi
    }

    const token = jwt.sign(payload, JWT_SECRET_KEY, { expiresIn: JWT_EXPIRE });

    return token;
}

UserSchema.methods.generateResetPasswordToken = function () {
    
    const {RESET_PASSWORD_EXPIRE} = process.env;
    //crypto kütüphanesi içerisinden randomBytesfonksiyonu ile rastgele 15 byte üretip bytlerı hex formatında stringe çevirdik
    const randomHexString = crypto.randomBytes(15).toString("hex");
    //console.log(randomHexString);
    
    //ürettiğimiz randomHexStringimizi createHash metodu ile istediğimiz algoritmaya göre update metodunu 
    //kullanarak hashledik  ve digest ile yine hex olarak ayarladık 
    const resetPasswordToken = crypto
        .createHash("SHA256")
        .update(randomHexString)
        .digest("hex")
    
    //Modelimiz üzerindeki resetpasswordtoken ve expire kısımlarını o anki kullanıcıya göre güncelledik
    this.resetPasswordToken = resetPasswordToken;    
    this.resetPasswordExpire = Date.now() + parseInt(RESET_PASSWORD_EXPIRE);

    //console.log(resetPasswordToken);    
    
    return resetPasswordToken;

}

//Mongoose un Pre and Post hook ları sayesinde belirtilen  db işleminden önce ve sonra yapıla-cak/bilecek işlemleri yaparız.
UserSchema.pre("save", function (next) {
    //Parola Değişmemişse
    if (!this.isModified("password")) {
        next();
    }

    bcrypt.genSalt(10, (err, salt) => {
        if (err) next(err); //Hata varsa customHandlerımıza gönderdik
        //hash(gönderdiğimizString, salt, (errorDeğişkeni, hashlenmişHaliniTutanDeğişken) )
        bcrypt.hash(this.password, salt, (err, hash) => {
            if (err) next(err); //hata varsa handlerımıza gönderdik
            this.password = hash; // hashlenmiş parolayı eskisi ile değiştirdik
            next();
        });
    });
    //console.log(this,"Pre Hooks : Save");
});
//Kullanıcı silindiğinde tüm sorularını da silme bu kısım opsiyonel olabilir.
//Post hookunu silme işşemi olduktan sonraya ayarladık

// UserSchema.post("remove", async function(next){
//     //Question modelimiz ile user: değeri silinen elemanın _id sine eşit olan tüm soruları siliyoruz
//     await Question.deleteMany({
//         user: this._id
//     })
//     next()
// })

//Mongoose içerisine modelimizi kayıt ettik ve export ettik
export default mongoose.model("User", UserSchema);
