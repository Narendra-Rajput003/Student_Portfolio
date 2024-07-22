import express, { urlencoded } from "express"
import helmet from "helmet"
import cors from "cors"
import fileUpload from "express-fileupload"
import CookieParser from "cookie-parser"


import { limiter } from "./middleware/rateLimiter.js"
import userRouter from "./routes/user_route.js"
import timelineRouter from "./routes/timeline_route.js"
import messageRouter from "./routes/message_route.js"
import skillRouter from "./routes/skill_route.js"
import softwareApplicationRouter from "./routes/softwareapplication_route.js"
import projectRouter from "./routes/project_route.js"

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
app.use(CookieParser());


dbConnect();
// route 
app.use("/api/v1/user", userRouter);
app.use("/api/v1/timeline", timelineRouter);
app.use("/api/v1/message", messageRouter);
app.use("/api/v1/skill", skillRouter);
app.use("/api/v1/softwareapplication", softwareApplicationRouter);
app.use("/api/v1/project", projectRouter);

app.listen(PORT,()=>{
    console.log(`server is running on port ${PORT}`);
})


