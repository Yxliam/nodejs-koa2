module.exports = async (ctx,next)=>{
    //请求成功
    ctx.success = ({data,msg}) =>{
        ctx.body = { code: 200, data, msg };
    };
    //传递给下一个中间件
    await next();
}