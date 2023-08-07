export const searchHelper = (searchKey, query, req) => {
    if (req.query.search) {
        const searchObject = {};
        const regex = new RegExp(req.query.search, 'i'); //Regex'i istediğimiz flag ile oluşturuyoruz biz burada i flagini yaniküçük büyük harf duyarsızlaştırdık
        searchObject[searchKey] = regex; //oluşturduğumuz objemizin içine title a göre filitre yapacağımız için regexi ekledik

        return query = query.where(searchObject);
        // queryC = queryC.where(searchObject);
    }
    return query;
}

export const populateHelper = (query, population) => {
    return query.populate(population);
}

export const questionSortHelper = (query, req) => {
    const sortKey = req.query.sortBy
    //Her durumda oluşturulma tarihi en yeni olacak şekilde sıralar
    if (sortKey === "most-answered") {
        return query.sort("-answersCount -createdAt") //Büyükten küçüğe doğru (azalan) soru sayısına göre sıralar
    }
    else if (sortKey) {
        return query.sort("-likesCount -createdAt")
    }

    return query.sort("-createdAt")
}

export const paginationHelper = async (model, query, req) => {
    //PAGINATION
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;

    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    const pagination = {};
    const total = await model.countDocuments(); // burada awaiy ile beklediğimiz için bu fonskiyondan gelen değeri alabilmek içinde await yapmamız gerek
    const totalPage = Math.ceil(total / limit);
    pagination.current_page = page;
    pagination.total_page = totalPage;
    //1 2 3 4 5 6  7 8 9 10  -> 10 tane soru var
    //page = 2  limit = 5   startIndex = 5  5. indexten başlayacak bir öncesinde 0 dan 4. ye kadar gelmişti
    //skip(startIndex) kaç tane atlanacağını söyledik aslında nereden başlanacağı gibi düşünülebilir
    //limit(limit) kaç tane alıncağını söyledik

    // const total = await queryC.countDocuments();

    //Eğer startIndex yani başlnagıç indexi 0 dan büyükse o zaman bir önceki sayfa vardır ve ekleriz 
    if (startIndex > 0) {
        pagination.previous =
        {
            page: page - 1,
            limit: limit
        }
    }
    //Eğer endIndex total (tüm soru sayısı) den küçükse bir sonraki sayfa vardır ve ekleriz 
    if (endIndex < total) {
        pagination.next =
        {
            page: page + 1,
            limit: limit
        }
    }

    return {
        query: query.skip(startIndex).limit(limit),
        pagination: pagination
    }
}