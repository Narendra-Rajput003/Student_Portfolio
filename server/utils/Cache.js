import redis from "../config/redis_config.js";



export const getCache=async(key)=>{
    const cacheDetails=await redis.get(key);
   return  cacheDetails ?  JSON.parse(key) :null ;

}

export const setCache=async(key,data,ttl=30)=>{
    await redis.set(key,JSON.stringify(data),{
        EX:ttl
    }) 

}

export const deletCache=async(key)=>{
    await redis.del(key)
}