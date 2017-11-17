var router = require('koa-router')();
// 处理数据库
var userModel=require('../lib/mysql.js');
//md5加密
var md5 = require('md5')
//验证码
var svgCaptcha = require('svg-captcha');
//get 注册页 异步
router.get('/singup',async (ctx,next) => {
    await ctx.render('signup',{     
        session:ctx.session,   
        active:'singup',
        title:'注册'
    })
})

//验证码
router.get('/captcha',async (ctx,next)=>{
    var captcha = svgCaptcha.create();
    ctx.session.captcha = captcha.text;
    ctx.type = 'svg';
    ctx.body = captcha.data
})


//注册接口
router.post('/register',async (ctx,next)=>{
    var user={
        name:ctx.request.body.name,
        pass:ctx.request.body.password,
        repeatpass:ctx.request.body.repeatpass,
        cap : ctx.request.body.cap
    }
    if(!user.cap || (user.cap).toLowerCase() !=(ctx.session.captcha).toLowerCase()){
        ctx.body={
            data:2,
            msg:"验证码错误"
        };
        return false;
    }
    
    await userModel.findDataByName(user.name)
            .then(result=>{
                // var res=JSON.parse(JSON.stringify(reslut))
                if (result.length){
                    try {
                        throw Error('用户存在')
                    }catch (error){
                        //处理err
                        console.log(error)  
                    }           
                    ctx.body={
                        data:1,
                        msg:'该用户已存在'
                    };;             
                }else if(user.name == '' || user.pass == ''){
                    ctx.body = {
                        dat:2,
                        msg:'用户名或者密码不能为空'
                    }
                }else if (user.pass!==user.repeatpass){
                    ctx.body={
                        data:2,
                        msg:'密码和重复密码不一致'
                    };              
                }else{
                    ctx.body={
                        data:3,
                        msg:"注册成功"
                    };
                    console.log('注册成功')
                    // ctx.session.user=ctx.request.body.name
                    userModel.insertData([ctx.request.body.name,md5(ctx.request.body.password)])
                }                           
            })

})


module.exports = router
