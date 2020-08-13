const mysql = require('mysql')

// 创建连接
function connectMysql(){
    const connection = mysql.createConnection({
        host: '127.0.0.1',
        user: 'root',
        password: 'root',
        database: 'message_test'
    })
    connection.connect()
    return connection;
}

module.exports.connectMysql = connectMysql