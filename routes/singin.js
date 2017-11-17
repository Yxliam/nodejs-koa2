var router = require('koa-router')();
var userModel = require('../lib/mysql.js')
var md5 = require('md5');
//验证码
var svgCaptcha = require('svg-captcha');

// get '/signin'登录页面
router.get('/signin',async (ctx,next)=>{
    await ctx.render('login',{
        session:ctx.session,
        active:'singin',
        title:'登录'
    })
})

//验证码
router.get('/login_captcha',async (ctx,next)=>{
    var captcha = svgCaptcha.create();
    ctx.session.logincapt = captcha.text;
    ctx.type = 'svg';
    // ctx.setHeader = 'Content-Type,image/svg+xml';
    ctx.body = captcha.data
})

router.get('/logout',async (ctx,next)=>{
    ctx.session = null

    ctx.redirect('/')
})

//post 登录接口
router.post('/login',async (ctx,next)=>{
    var user = {
        name:ctx.request.body.name,
        password:ctx.request.body.password,
        cap : ctx.request.body.cap
    }
    if(!user.cap || (user.cap).toLowerCase() != (ctx.session.logincapt).toLowerCase()){
        ctx.body={
            data:3,
            msg:"验证码错误"
        };
        return false;
    }
    if(user.name == '' || user.password == ''){
        ctx.body = {
            data:3,
            msg:'用户名或者密码不能为空'
        }
        return false;
    }
    //异步的 请求方法
    await userModel.findDataByName(user.name)
    .then(result=>{
        console.log( result );
        //此时的 result是一个 资源 所以需要用 JOSN.stringify转为json字符串，然后转为json对象
        var res =  JSON.parse( JSON.stringify(result) )
        if(user.name == res[0]['name'] && md5(user.password) == res[0]['pass']){
            ctx.body = {
                data:2,
                msg:'登录成功'
            }
            ctx.session.user = res[0]['name']
            ctx.session.id=res[0]['id']
            console.log('session',ctx.session)
            console.log('登录成功')
        }
    }).catch(err=>{
        ctx.body={
            data:3,
            msg:'用户名或者密码错误'
        }
        console.log('用户名或密码错误!')
    })
})

module.exports = router