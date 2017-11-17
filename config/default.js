

const config = {
    //启动端口
    port:49152,
    //数据库配置
    database:{
        DATABASE: '您的数据库名称',
        USERNAME: '数据库用户名',
        PASSWORD: '数据库密码',
        PORT: '3306',
        HOST: 'localhost'
    }
}

const dev = {
    //启动端口
    port:3000,
    //数据库配置
      database:{
        DATABASE: 'nodesql',
        USERNAME: 'root',
        PASSWORD: 'root',
        PORT: '3306',
        HOST: 'localhost'
    }
} 



//config de 是生产的 配置 dev是本地的配置
// module.exports = config
module.exports = dev