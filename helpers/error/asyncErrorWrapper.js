import expressAsyncHandler from "express-async-handler";
//async fonksiyonlarımızdaki hataları customErrorHandlerımıza gönderen express paketini asyncErrorWrapper olarak export ettik
const asyncErrorWrapper = expressAsyncHandler;

export default asyncErrorWrapper;