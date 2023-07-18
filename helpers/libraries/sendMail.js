import nodemailer from 'nodemailer';
//node mail paketimizi import ettik 
const sendmail = async (mailOptions) => {
    //async olarak mail gönderecek fonksiyoumuzu oluşturduk  mail optionslar kullanıcıdan alınacak 
    //transporter oluşturduk ve mail gönderici sistemin mail bilgilerini ve port numarasını girdik
    let transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST, //hangi sistem ile gmail / outlook vs.
        port: process.env.SMTP_PORT, //port sistemin çalışacağı numarası
        auth:{ //kullanıcı maili ve passwordu
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS
        }
    })

    //optionlarını aldığımız maili yolladık
    let info = await transporter.sendMail(mailOptions)

    console.log(`Mail send : ${info.messageId}`);
} 

export default sendmail;