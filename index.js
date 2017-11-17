var Koa = require('koa')
var path = require('path')
var bodyParser = require('koa-bodyparser')
var views = require('koa-views')
var session = require('koa-session-minimal')
var MysqlStore = require('koa-mysql-session')
var config = require('./config/default.js')
var router = require('koa-router')
var ejs = require('ejs');
var koaStatic = require('koa-static')
var app = new Koa()



//session 存储设置
const sessionMysqlConfig = {
    user: config.database.USERNAME,
    password: config.database.PASSWORD,
    database: config.database.DATABASE,
    host: config.database.HOST,
}

// 配置session中间件
app.use(session({
    key: 'USER_SID',
    store: new MysqlStore(sessionMysqlConfig)
}))

// 配置静态资源加载中间件
app.use(koaStatic(
    path.join(__dirname , './public')
))


// 配置服务端模板渲染引擎中间件 使用swig的模板
app.use(views(path.join(__dirname, './views'), {
   map: { html:'ejs' }
}))

  // 使用表单解析中间件
app.use(bodyParser())

// 使用新建的路由文件
app.use(require('./routes/index.js').routes())
app.use(require('./routes/singup.js').routes())
app.use(require('./routes/singin.js').routes())
//评论
app.use(require('./routes/comment.js').routes())

// 监听在3000端口
app.listen(config.port)
console.log(`listening on port ${config.port}`)