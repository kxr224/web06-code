const http = require('http')
const server = http.createServer()
const fs = require('fs')
const url = require('url')
const artTemplate = require('art-template')

const {
    redirect,
    parsePostParams
} = require('./utils/common')

const fileUtil = require('./utils/file-util')

const {
    connectMysql
} = require('./utils/mysql-utils')

const messageDao = require('./dao/message-dao')

// 小a添加的代码223
// 小a添加的代码121
server.on("request", function (request, response) {
    // 第一个参数 请求的url
    // 第二个参数，是否转换query参数
    const urlObj = url.parse(request.url, true);
    if (request.url.startsWith('/node_modules')) {
        // 代表加载node_modules中的内容
        // /node_modules/bootstrap/dist/css/bootstrap.min.css
        // fs.readFile('.' + request.url, function (err, data) {
        //     if (err) {
        //         response.end("404")
        //     } else {
        //         response.end(data)
        //     }
        // })
        fileUtil.readFile('.' + request.url, response)
    } else if (urlObj.pathname == '/delete') {
        console.log(urlObj.query);
        // 进行删除
        messageDao.del(urlObj.query.id).then(res => {
            redirect('/', response)
        }).catch(err => {
            console.error(err);
            fileUtil.errorPage("删除失败", response)
        })
        // 跳转到首页
        // response.end()
    } else if (urlObj.pathname == '/' || urlObj.pathname == '/index') {
        // 加载首页
        // 在加载首页的时候需要加载数据，所以可以在这个位置，查询出mysql中的数据
        // 打开连接
        // const connection = connectMysql()

        // let sql = 'select * from message';
        // connection.query(sql, function (sqlErr, res) {
        //     if (sqlErr) {
        //         fs.readFile('./views/error.html', function (err, data) {
        //             console.error(sqlErr);
        //             response.end(artTemplate.render(data.toString(), {
        //                 error: '查询出错'
        //             }))
        //         })
        //     } else {
        //         fs.readFile('./views/message-list.html', function (err, data) {
        //             if (err) {
        //                 response.end("404")
        //             } else {
        //                 response.end(artTemplate.render(data.toString(), {
        //                     messageList: res
        //                 }))
        //             }
        //         })
        //     }
        //     connection.end()
        // })

        messageDao.select(urlObj.query).then(res => {
            // fs.readFile('./views/message-list.html', function (err, data) {
            //     if (err) {
            //         response.end("404")
            //     } else {
            //         response.end(artTemplate.render(data.toString(), {
            //             messageList: res
            //         }))
            //     }
            // })
            fileUtil.readFileRender('./views/message-list.html', response, {
                messageList: res
            })
        }).catch(sqlErr => {
            // fs.readFile('./views/error.html', function (err, data) {
            //     console.error(sqlErr);
            //     response.end(artTemplate.render(data.toString(), {
            //         error: '查询出错'
            //     }))
            // })
            console.error(sqlErr);
            fileUtil.errorPage('查询出错', response)
        })


    } else if (urlObj.pathname == '/save') {
        // 调用了保存的接口
        // messageList.push(urlObj.query)
        // const connection = connectMysql()

        // const sql = 'insert into message(name,content) values (?,?)'
        // connection.query(sql, [urlObj.query.name, urlObj.query.content], (sqlErr, res) => {
        //     if (sqlErr) {
        //         fs.readFile('./views/error.html', function (err, data) {
        //             console.error(sqlErr);
        //             response.end(artTemplate.render(data.toString(), {
        //                 error: '查询出错'
        //             }))
        //         })
        //     } else {
        //         response.setHeader('Location', '/index')
        //         response.statusCode = 302
        //         // 每个响应都需要结束
        //         response.end()
        //     }
        //     connection.end()
        // })

        messageDao.insert(urlObj.query.name, urlObj.query.content).then(res => {
            // response.setHeader('Location', '/index')
            // response.statusCode = 302
            // // 每个响应都需要结束
            // response.end()
            redirect('/index', response)
        }).catch(sqlErr => {
            // fs.readFile('./views/error.html', function (err, data) {
            //     console.error(sqlErr);
            //     response.end(artTemplate.render(data.toString(), {
            //         error: '查询出错'
            //     }))
            // })
            console.error(sqlErr);
            fileUtil.errorPage('查询出错', response)
        })

    } else if(urlObj.pathname == '/update'){
        // 执行修改操作
        // 拿到post的参数
        // 通过request 监听post数据变化
        console.log("更新了");
        request.on('data',function (chunk){
            let paramsStr = decodeURI(chunk.toString())
            // console.log(url.parse("/llala?"+paramsStr,true));
            let params = parsePostParams(paramsStr);
            messageDao.update(params).then(res=>{
                redirect('/index',response)
            }).catch(err=>{
                fileUtil.errorPage("更新错误",response)
            })
        })
    } else if(urlObj.pathname == '/ajax/update'){
        request.on('data',function (chunk){
            let paramsStr = decodeURI(chunk.toString())
            console.log(paramsStr);
            // console.log(url.parse("/llala?"+paramsStr,true));
            // let params = parsePostParams(paramsStr);
            messageDao.update(JSON.parse(paramsStr)).then(res=>{
                let result = {
                    message:'更新成功',
                    success:true
                }
                response.setHeader('Content-Type',"application/json; charset=utf-8")
                response.end(JSON.stringify(result))
            }).catch(err=>{
                fileUtil.errorPage("更新错误",response)
            })
        })
    } else {
        // fs.readFile('./views' + request.url, function (err, data) {
        //     if (err) {
        //         response.end("404")
        //     } else {
        //         response.end(data)
        //     }
        // })
        fileUtil.readFile('./views' + request.url, response)
    }
})

server.listen(3000, function () {
    console.log("服务启动在3000端口");
})