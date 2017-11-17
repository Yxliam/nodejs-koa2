var mysql = require('mysql');
var config = require('../config/default.js')

//定义pool池
var pool  = mysql.createPool({
    host     : config.database.HOST,
    user     : config.database.USERNAME,
    password : config.database.PASSWORD,
    database : config.database.DATABASE
  });

let query = function( sql, values ) {
    
      return new Promise(( resolve, reject ) => {
        pool.getConnection(function(err, connection) {
          if (err) {
            resolve( err )
          } else {
            connection.query(sql, values, ( err, rows) => {
              if ( err ) {
                reject( err )
              } else {
                resolve( rows )
              }
              //回收pool
              connection.release()
            })
          }
        })
      })
    
    }



// 根据页数返回数据
let findPageById = function(page){
  let _sql=`select * from posts limit ${(page-1)*5},5;`
  return query(_sql)
}
// 注册用户
let insertData = function( value ) {
    let _sql = "insert into users(name,pass) values(?,?);"
    return query( _sql, value )
  }
  // 发表文章
  let insertPost = function( value ) {
    let _sql = "insert into posts(name,title,content,uid,moment) values(?,?,?,?,?);"
    return query( _sql, value )
  }
  // 更新文章评论数
  let updatePostComment = function( value ) {
    let _sql = "update posts set  comments=? where id=?"
    return query( _sql, value )
  }
  
  // 更新浏览数
  let updatePostPv = function( value ) {
    let _sql = "update posts set  pv=? where id=?"
    return query( _sql, value )
  }
  
  // 发表评论
  let insertComment = function( value ) {
    let _sql = "insert into comment(name,content,postid,moment) values(?,?,?,?);"
    return query( _sql, value )
  }
  // 通过名字查找用户
  let findDataByName = function (  name ) {
    let _sql = `
      SELECT * from users
        where name="${name}"
        `
    return query( _sql)
  }
  // 通过文章的名字查找用户
  let findDataByUser = function (  name ) {
    let _sql = `
      SELECT * from posts
        where name="${name}"
        `
    return query( _sql)
  }
  // 通过文章id查找
  let findDataById = function (  id ) {
    let _sql = `
      SELECT * from posts
        where id="${id}"
        `
    return query( _sql)
  }
  // 通过评论id查找
  let findCommentById = function ( id ) {
    let _sql = `
      SELECT * FROM comment where postid="${id}"
        `
    return query( _sql)
  }
  
  // 查询所有文章
  let findAllPost = function (  ) {
    let _sql = `
      SELECT * FROM posts
        `
    return query( _sql)
  }
  //查询所有文章的条数
  let findAllCountPost = function(){
    let _sql = `select count(*) from posts`
    return query(_sql)
  }
  // 更新修改文章
  let updatePost = function(values){
    let _sql=`update posts set  title=?,content=? where id=?`
    return query(_sql,values)
  }
  // 删除文章
  let deletePost = function(id){
    let _sql=`delete from posts where id = ${id}`
    return query(_sql)
  }
  // 删除评论
  let deleteComment = function(id){
    let _sql=`delete from comment where id = ${id}`
    return query(_sql)
  }
  // 删除所有评论
  let deleteAllPostComment = function(id){
    let _sql=`delete from comment where postid = ${id}`
    return query(_sql)
  }
  // 查找
  let findCommentLength = function(id){
    let _sql=`select content from comment where postid in (select id from posts where id=${id})`
    return query(_sql)
  }



module.exports = {
    query,
    insertData,
    findDataByName,
    insertPost,
    findAllPost,
    findDataByUser,
    findDataById,
    insertComment,
    findCommentById,
    updatePost,
    deletePost,
    deleteComment,
    findCommentLength,
    updatePostComment,
    deleteAllPostComment,
    updatePostPv,
    findPageById,
    findAllCountPost
}