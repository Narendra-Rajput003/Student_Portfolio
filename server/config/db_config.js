import mongoose from "mongoose";


export const dbConnect=()=>{
    return new Promise((resolve,reject)=>{
        mongoose.connect(process.env.MONGODB_URL)
       .then(()=>{
            console.log("Database Connected")
            resolve()
        })
       .catch((err)=>{
            console.log("Database Connection Error")
            reject(err)
        })
    })
}