const fs = require('fs')
const artTemplate = require('art-template')


function readFile(path,response){
    fs.readFile(path, function (err, data) {
        if (err) {
            response.end("404")
        } else {
            response.end(data)
        }
    })
}

function readFileRender(path,response,data){
    fs.readFile(path,function(error,result){
        if(error){
            response.end("404")
        }else {
            response.end(artTemplate.render(result.toString(),data))
        }
    })
}

function errorPage(msg,response){
    fs.readFile('./views/error.html', function (err, data) {
        // console.error(sqlErr);
        response.end(artTemplate.render(data.toString(), {
            error: msg
        }))
    })
}

exports.readFile=readFile
exports.readFileRender=readFileRender
exports.errorPage=errorPage