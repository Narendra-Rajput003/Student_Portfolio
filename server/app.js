import express, { urlencoded } from "express"
import helmet from "helmet"
import cors from "cors"
import fileUpload from "express-fileupload"

import { limiter } from "./middleware/rateLimiter.js"
import createProxyMiddlewareForTarget from "./middleware/http-proxy.js"
import {dbConnect} from "./config/db_config.js"
const app=express();

const PORT=process.env.PORT || 5000;



app.use(cors());
app.use(helmet());
app.use(fileUpload({
    useTempFiles : true,
    tempFileDir : '/tmp/'
}));
app.use(express.json(urlencoded({extended:true})));
app.use(limiter);


// route 
app.use(createProxyMiddlewareForTarget("auth"));

app.listen(PORT,()=>{
    console.log(`server is running on port ${PORT}`);
})

dbConnect();
