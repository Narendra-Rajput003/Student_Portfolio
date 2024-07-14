import {rateLimit} from "express-rate-limit"

export const limiter=rateLimit({
    windowMs:1*60*1000,
    max:10,
    message:"Too many requests from this IP, please try again after an minute",
    standardHeaders: 'draft-7',
	legacyHeaders: false,
    statusCode:429,
    keyGenerator:(req)=>(req) => req.ip,

})

