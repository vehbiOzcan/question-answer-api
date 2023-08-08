import asyncErrorWrapper from "../../helpers/error/asyncErrorWrapper.js"
import { objectIdCasting } from "../database/objectIdCasting.js";
import { paginationHelper, populateHelper } from "./queryMiddlewareHelpers.js";

//Bu middleware ilgili sorumuzun cevaplarını almaya ve paginate etmeye yarar.
//Çalışma şekli gelen sorunun id sini alır ve sorumuzun cevap sayısını veri tabanından çekip paginate eder
// ardından answer kısmını populate eder.
export const answerQueryMiddleware = function (model,options) {

    return asyncErrorWrapper(async function (req, res, next) {
        let id  = req.params.id; //İşlem yapılan sorumuzun id'si
        id = objectIdCasting(id.trim())
        const arrayName = "answers";

        const total = (await model.findById(id))["answersCount"];
        const paginationResult = paginationHelper(total, undefined, req);
        const startIndex = paginationResult.startIndex;
        const limit = paginationResult.limit

        const queryObject = {};
        queryObject[arrayName] = { $slice: [startIndex, limit] };
        //Bu MongoDb'nin bir arrayı bölmeye yarayan metodu başlangıç indisi ve kaç eleman olarak böleceğini alır
        let query = model.find({ _id: id }, queryObject); //Answer kısmını paginate ederek query oluşturduk ;
        
        query = populateHelper(query,options.population);
        
        const queryResults = await query;

        res.queryResults = {
            success: true,
            pagination: paginationResult.pagination,
            data: queryResults
        };

        next();
    })

}