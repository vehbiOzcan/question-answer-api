import asyncErrorWrapper from "../../helpers/error/asyncErrorWrapper.js"
import { paginationHelper, populateHelper, questionSortHelper, searchHelper } from "./queryMiddlewareHelpers.js";

export const questionQueryMiddleware = function (model, options) {//Gönderdiğimiz modelimi ve search,populate vs. opsiyonları alıyor
    //bu geriye bir middleware dönüyor biz orada option alark verdiğimiz için geriye bir async function yani, asıl middlewaremizi dönmesi gerek
    return asyncErrorWrapper(async function (req, res, next) {
        //Başlangıç query'si (Mongoda sorgular fonskiyon şeklinde olduğu için bu şekilde başlatıyoruz)
        let query = model.find();

        //Aşağıdaki fonksiyonlar tek bir controller içinde yapılan karmaşık filtre, sıralama ve sayfalama işlemini
        //sadece kendi görevini yapacak şekilde fonksiyonlara bölmeye yarıyor
        //her fonksiyon başlangıçta oluşturduğumuz query yi alıp içinde kendi ilgili işlemini yaparak query nesnesini düzenliyor ve geri dönüyor en son aşamada 
        //query nesnesini await ile derleyip sonucunu queryResult a atıyor ve res üzerine ekiyoruz .

        //Search
        query = searchHelper('title', query, req)

        //Population
        if (options && options.population) {
            query = populateHelper(query, options.population)
        }

        //Sorting
        query = questionSortHelper(query, req);
       
        //Pagination
        const totalDocuments = await model.countDocuments();
        const paginationResult = await paginationHelper(totalDocuments, query, req);
        query = paginationResult.query;
        const pagination = paginationResult.pagination;

        const queryResult = await query;

        res.queryResult = {
            success:true,
            count: queryResult.length,
            pagination: pagination,
            data: queryResult
        };

        next();
    })

} 