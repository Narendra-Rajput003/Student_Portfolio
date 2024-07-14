import nodemailer from "nodemailer";



export const  emailSender =async(toMail,subject,body)=>{

    try {

        let transporter=nodemailer.createTransport({
            host: process.env.MAIL_HOST,
            auth: {
                user:process.env.MAIL_USER,
                pass: process.env.MAIL_PASS,
            },
        });
        let info=await transporter.sendMail({
            from:'Student-Portfolio',
            to:`${toMail}`,
            subject:`${subject}`,
            html:`${body}`
        })
        console.log("Message sent: %s", info.messageId);
        return true;
        
    } catch (error) {
        console.log(error);
        return false;
        
    }

}