class CustomError extends Error {
    //Bu sınıf bizim kendi hata türlerimizi oluşturmamızı ve 
    //yakaladığımız hataları özelleştirmemizi sağlayacak 
    //Error sınıfını extend ederek tüm hata türlerini yakalyabilmemizi sağlıyor
    //ayrıca statusu olmayan hatalara da kendimiz status atayabiliyoruz
    constructor(message,status){
        super(message);
        this.status = status;
    }

}

export default CustomError;