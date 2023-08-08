import asyncErrorWrapper from "../../helpers/error/asyncErrorWrapper.js"
import { paginationHelper, searchHelper } from "./queryMiddlewareHelpers.js";

export const userQueryMiddleware = function (model) {

    return asyncErrorWrapper(async function (req, res, next) {
        let query = model.find();

        query = searchHelper("name", query, req);
        const totalDocuments = await model.countDocuments();
        const paginationResult = await paginationHelper(totalDocuments, query, req);
        query = paginationResult.query;
        const pagination = paginationResult.pagination;
        const queryResult = await query;

        res.queryResult = {
            success: true,
            count: queryResult.length,
            pagination: pagination,
            data: queryResult
        }
        next();
    })
}