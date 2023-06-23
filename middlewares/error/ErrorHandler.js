//Kendi custom error handlerımızı oluşturduk
const customErrorHandler = (err, req, res, next) => {
   
    console.log(err);

    res
        .status(400)
        .json({
            success: false
        })
}

const ErrorHandler = {customErrorHandler,}

export default ErrorHandler;