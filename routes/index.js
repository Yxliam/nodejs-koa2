var router = require('koa-router')();
var userModel = require('../lib/mysql.js');
var moment = require('moment');

router.get('/',async (ctx,next)=>{
    await ctx.render('index',{
        session:ctx.session,
        active:'index',
        title:'首页'
    })
})

router.get('/create',async (ctx,next)=>{
    await ctx.render('create',{
        session:ctx.session,
        active:'create',
        title:'添加文章'
    })
})

router.post('/add_post',async (ctx,next)=>{
    var title=ctx.request.body.title
    var content=ctx.request.body.content
    var id=ctx.session.id
    var name=ctx.session.user
    var time = moment().format('YYYY-MM-DD HH:mm')
    await userModel.insertPost([name,title,content,id,time])
        .then(result=>{
            ctx.body = {
                data:2,
            }
        }).catch(err=>{
            ctx.body = {
                data:3,
                msg:'发表文章失败:'+err
            }
        })
})

//取得所有的文章 和
router.get('/list',async (ctx,next)=>{
    var query = ctx.request.querystring
    var page = query.split('=')[1];
    var pages = 1
    if(!page){
        ctx.body = {
            data:3,
            list:res,
            list:[]
        }
    }
    await userModel.findAllCountPost()
        .then(ress=>{
           counts = JSON.parse(JSON.stringify(ress))[0]['count(*)']
           pages = Math.ceil(counts/5)
        })
    await userModel.findPageById(page)
        .then(result=>{
                res = JSON.parse(JSON.stringify(result))
                ctx.body = {
                    list:res,
                    pages:pages,
                    data:2
                }
               
            }).catch(err=>{
                ctx.body = {
                    data:1,
                }
            })
        //  await userModel.findAllPost()
        //     .then(result=>{
        //         res = JSON.parse(JSON.stringify(result))
        //         ctx.body = {
        //             list:res,
        //             data:2
        //         }
               
        //     }).catch(err=>{
        //         ctx.body = {
        //             data:1,
        //         }
        //     })
           
})


router.get('/my_page',async (ctx,next)=>{
    await ctx.render('my_page',{
        session:ctx.session,
        active:'my',
        title:'我的发表'
    })
})


router.get('/my_list',async (ctx,next)=>{
    var query = ctx.request.querystring
       var name = query.split('=')[1];
       //因为链接有中文 ，所以我们需要解码 使用decodeURIComponent
       await userModel.findDataByUser(decodeURIComponent(name))
           .then(result=>{
               res = JSON.parse(JSON.stringify(result))
               ctx.body = {
                   list:res,
                   data:2
               }
       
           }).catch(err=>{
               ctx.body = {
                   data:1,
               }
           })
})

//根据id取出文章

router.get('/list/:pid',async (ctx,next)=>{
        var id = ctx.params.pid
        if(id){
           ctx.body = {
               data:1,
               msg:'id err'
           } 
        }

        await userModel.findDataById(id)
            .then(result => {
                res = JSON.parse( JSON.stringify(result))
                postPv = parseInt(res[0]['pv'])
                postPv +=1
            })
            //更新浏览数
            await userModel.updatePostPv([postPv,id])
            //查找评论
            await userModel.findCommentById(id)
                .then(result=>{
                    comments = JSON.parse(JSON.stringify(result))
                })
            // 渲染模板，并传递三个数据     
            await ctx.render('post_tpl',{
                session:ctx.session,
                posts:res[0],
                comments:comments,
                active:'index',
                title:'文章详情'
            })

})






module.exports = router