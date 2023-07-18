import multer from "multer";
import path, {dirname} from 'path';
import { fileURLToPath } from "url";
import CustomError from "../../helpers/error/CustomError.js";

const storage = multer.diskStorage({
    //cb(hata,dosyamızın ilgili bilgisi) hata yoksa null gönderilir herhangi bir dosya bilgisi yoksa devam etmesi için true gönderilir 
    //hata varsa hata gönderilir ikinci parametre olarak ta false gönderilir 
    destination: function (req, file, cb) { //dosya yolunu yani nereye kayır edileceğini ayarladık
        const __filename = fileURLToPath(import.meta.url); // bu dosyamızın yolu  maa biz aşağıda path.dirname ile projenin ana dizinini aldık
        const rootDir = dirname(dirname(dirname(__filename))) //üst klasöre çıktık
        cb(null, path.join(rootDir, 'public/uploads'));
    },

    filename: function (req, file, cb) {
        //File - Mimetype => image/png , image/jpeg  ,image/jpg  vs şeklindedir

        const extension = file.mimetype.split("/")[1];
        req.savedProfileImage = `image_${req.user.id}.${extension}`; //req uzerine dosyanmızın ismini ve formatını ekledik daha sonra 
        //hem db ye ekleyebilmek için aynı zamnanda hemde multerında kayıt etmesi için 
        cb(null, req.savedProfileImage);
    }
})

const fileFilter = (req, file, cb) => {
    let allowedMimeTypes = ["image/png","image/jpg","image/jpeg","image/gif"]; //kabul ettiğimiz formatları girdik yani mimetypeslarımızı
    if(!allowedMimeTypes.includes(file.mimetype)){
        return cb(new CustomError("Please provide a valid image file",400),false);
    }
    return cb(null,true);
}

const profileImageUpload = multer({storage,fileFilter}); //middleware olarak oluşturduk 
export default profileImageUpload;//export ettik