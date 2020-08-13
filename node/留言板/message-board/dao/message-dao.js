const {
    connectMysql
} = require('../utils/mysql-utils')
// 输入：
//     name
//     content
//     id
// 输出：
//      查询到的内容（Promise解决异步问题）
function select(condition = {}) {
    return new Promise((resolve, reject) => {
        const connection = connectMysql()
        let sql = "select * from message where 1=1 ";
        if (condition.name) {
            sql += ` and name = '${condition.name}'`
        }
        if (condition.content) {
            sql += ` and content like '%${condition.content}%'`
        }
        if (condition.id) {
            sql += ` and id = '${condition.id}'`
        }
        connection.query(sql, function (error, result) {
            if (error) {
                reject(error)
            } else {
                resolve(result)
            }
            connection.end()
        })
    })
}

/**
 * mvc  modal view controller
 * 创建一条留言
 * @param {*} name  名字
 * @param {*} content  内容
 */
function insert(name, content) {
    return new Promise((resolve, reject) => {
        const connection = connectMysql();
        const sql = `insert into message(name,content) values (?,?)`
        connection.query(sql, [name, content], function (err, res) {
            if (err) {
                reject(err)
            } else {
                resolve(res)
            }
            connection.end()
        })
    })
}

function del(id) {
    return new Promise((resolve, reject) => {
        const connection = connectMysql();
        const sql = "delete from message where id = " + id
        connection.query(sql, function (err,data) {
            if(err){
                reject(err)
            }else {
                resolve(data)
            }
            connection.end()
        })
    })
}

function update(message){
    return new Promise((resolve, reject)=>{
        const connection = connectMysql();
        const sql = "update message set name = ?,content = ? where id = ?"
        connection.query(sql,[message.name,message.content,message.id],function(err,data){
            if(err){
                reject(err)
            }else {
                resolve(data)
            }
            connection.end()
        })
    })
}

exports.select = select
exports.insert = insert
exports.del = del
exports.update = update