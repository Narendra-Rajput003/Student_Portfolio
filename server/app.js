import express from "express"
import {dbConnect} from "./config/db_config.js"
const app=express();

const PORT=process.env.PORT || 5000;





app.listen(PORT,()=>{
    console.log(`server is running on port ${PORT}`);
})

dbConnect();
