// 重定向
function redirect(url,response){
    response.setHeader('Location', url)
    response.statusCode = 302
    // 每个响应都需要结束
    response.end()
}

function parsePostParams(paramsStr){
    // console.log(paramsStr);
    // paramsStr : id=14&name=mingzi&content=啦啦啦
    let paramsList = paramsStr.split('&')
    // paramsList : ["id=14", "name=mingzi","content=啦啦啦"]
    let paramsObj = {}
    paramsList.forEach(item=>{
        //item : "id=14"
        let paramsItemList= item.split('=')
        //paramsItemList : ["id","14"]
        paramsObj[paramsItemList[0]] = paramsItemList[1]
    })
    // { id: '14', name: 'mingzi', content: '啦啦啦' }
    // console.log(paramsObj);
    return paramsObj;
}

exports.redirect = redirect
exports.parsePostParams = parsePostParams