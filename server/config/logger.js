import winston ,{format}from "winston";


const {combine,timestamp,label,printf}=format

const myformat=printf(({level,message,label,timestamp})=>{
    return `${timestamp} [${label}] ${level}: ${message}`;
})
console.log("myformat",myformat);
console.log(combine,timestamp,label,printf);

const logger=winston.createLogger({
    level: 'info',
    format:combine(label({ label: "right now!" }), timestamp(), myformat),
    defaultMeta: { service: 'user-service' },
    transports: [
        new winston.transports.File({ filename: "error.log", level: "error" }),
        new winston.transports.File({ filename: "logs.log" }),
    ],
})

export default logger;