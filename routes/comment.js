var router = require('koa-router')();
// 处理数据库
var userModel=require('../lib/mysql.js');
var moment = require('moment')



  router.post('/check_login',async (ctx,next)=>{
      if(ctx.session && ctx.session.user){
        ctx.body = {
            data:2
        }
      }else{
          ctx.body = {
              data:3
          }
      }
  })


//添加评论
router.post('/add_comment',async (ctx,next)=>{
    var comment = ctx.request.body.comment;
    var name = ctx.session.user;
    var pid = ctx.request.body.pid
    var time = moment().format('YYYY-MM-DD HH:mm')
    if(!parseInt(pid)){
        ctx.body = {
            data:3,
            msg:'id err'
        }
    }
    await userModel.insertComment([name,comment,pid,time])
    await userModel.findDataById(pid)
    .then(res=>{
        comment_num = parseInt(JSON.parse(JSON.stringify(res))[0]['comments']);
        comment_num+=1
    })
    //更新评论数
    await userModel.updatePostComment([comment_num,pid])
        .then(ress=>{
            ctx.body = {
                data:2,
                msg:'评论成功'
            }
        })
    
})
//获取评论总数
router.post('/comment_list',async (ctx,next)=>{
    var pid = ctx.request.body.pid;
    await userModel.findCommentById( pid )
        .then(res=>{
            var result = JSON.parse(JSON.stringify(res))
            ctx.body = {
                list:result,
                data:2,
            }
        }).catch(err=>{
            ctx.body = {
                data:2,
                msg:err
            }
        })
})


module.exports = router