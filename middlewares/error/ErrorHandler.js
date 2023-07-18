
//Kendi custom error handlerımızı oluşturduk
import CustomError from "../../helpers/error/CustomError.js";

const customErrorHandler = (err, req, res, next) => {
   let customErr = err;
    console.log(err.name,err.message);

    if(err.name === 'CastError'){
        customErr = new CustomError("Please provide a valid id", 400)
    }

    if(err.name === "SyntaxError"){
        customErr = new CustomError("Unexpected Syntax", 400)
    }
    if(err.name === "ValidationError"){
        customErr = new CustomError(err.message, 400)
    }
    if(err.code === 11000){
        customErr = new CustomError("Duplicate key found : check your input", 400)
    }

    res
        .status(customErr.status || 500)
        .json({
            success: false,
            message: customErr.message || "Internal Server Error"
        })
}

const ErrorHandler = {customErrorHandler,}

export default ErrorHandler;