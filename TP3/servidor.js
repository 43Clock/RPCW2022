var http = require('http');
var fs = require("fs")
var url = require("url")
const axios = require('axios')

function getAlunos(){
    return axios.get("http://localhost:3000/alunos")
    .then(resp => {
        data = resp.data
        return data
    })
}

function getAluno(id){
    return axios.get("http://localhost:3000/alunos/"+id)
    .then(resp => {
        data = resp.data
        return data
    })
}

function getCursos(){
    return axios.get("http://localhost:3000/cursos")
    .then(resp => {
        data = resp.data
        return data
    })
}

function getInstrumentos(){
    return axios.get("http://localhost:3000/instrumentos")
    .then(resp => {
        data = resp.data
        return data
    })
}

function toTitleCase(str) {
    return str.replace(
      /\w\S*/g,
      function(txt) {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
      }
    );
  }

function writeAlunos(data){
    str = `
        <table>
        <tr>
            <th>ID</th>
            <th>Nome</th>
            <th>Curso</th>
            <th>Instrumento</th>
        </tr>
    `;
    data.forEach(ele =>{
        str += `<tr>
                    <td>${ele.id}</td>
                    <td><a href="http://localhost:4000/alunos/${ele.id}">${toTitleCase(ele.nome)}</a></td>
                    <td>${ele.curso}</td>
                    <td>${ele.instrumento}</td>
                </tr>`
    })
    str += "</table>"
    return str
}

function writeAluno(data){
    str = `
        <h1>Aluno ${data.id}</h1>
        <p><b>Nome</b>: ${toTitleCase(data.nome)}</p>
        <p><b>Data de Nascimento</b>: ${data.dataNasc}</p>
        <p><b>Curso</b>: ${data.curso}</p>
        <p><b>Ano de Curso</b>: ${data.anoCurso}</p>
        <p><b>Instrumento</b>: ${data.instrumento}</p>
    `
    return str
}

function writeCursos(data){
    str = `
        <table>
        <tr>
            <th>ID</th>
            <th>Designação</th>
            <th>Duração</th>
            <th>Instrumento</th>
        </tr>
    `;
    data.forEach(ele =>{
        str += `<tr>
                    <td>${ele.id}</td>
                    <td>${toTitleCase(ele.designacao)}</td>
                    <td>${ele.duracao}</td>
                    <td>${ele.instrumento["#text"]}</td>
                </tr>`
    })
    str += "</table>"
    return str
}

function writeInstrumentos(data){
    str = `
        <table>
        <tr>
            <th>ID</th>
            <th>Nome</th>
        </tr>
    `;
    data.forEach(ele =>{
        str += `<tr>
                    <td>${ele.id}</td>
                    <td>${ele["#text"]}</td>
                </tr>`
    })
    str += "</table>"
    return str
}

myserver = http.createServer(function (req,res){
    var myurl = url.parse(req.url,true).pathname
    if (myurl == "/"){
        fs.readFile("./index.html",(err,data) => {
            res.writeHead(200,{'Content-Type':'text/html;charset=utf-8'});
            if(err){
                res.write("<p>Erro na leitura do ficherio...</p>")
            }else{
                res.write(data)
            }
            res.end()
        })
    }
    else if (myurl.includes("/alunos")){
        if(myurl == "/alunos" || myurl=="/alunos/"){
        getAlunos()
            .then(data =>{
                res.writeHead(200,{'Content-Type':'text/html;charset=utf-8'});
                res.write(writeAlunos(data))
                res.end()
            })
        
        }
        else if (myurl.includes("/alunos/")){
            let id = myurl.split("/")[2]
            getAluno(id).then(data=>{
                    res.writeHead(200,{'Content-Type':'text/html;charset=utf-8'});
                    res.write(writeAluno(data))
                    res.end()
                }).catch(err=>{
                    res.writeHead(400,{'Content-Type':'text/html;charset=utf-8'});
                    res.end()
                })   
        }
    }
    else if (myurl.includes("/cursos")){
        if(myurl == "/cursos" || myurl == "/cursos/"){
            getCursos()
            .then(data =>{
                res.writeHead(200,{'Content-Type':'text/html;charset=utf-8'});
                res.write(writeCursos(data))
                res.end()
            })
        }
        else{
            res.writeHead(404,{'Content-Type':'text/html;charset=utf-8'});
            res.end()
        }
    }
    else if (myurl.includes("/instrumentos")){
        if(myurl == "/instrumentos" || myurl == "/instrumentos/"){
            getInstrumentos()
            .then(data =>{
                res.writeHead(200,{'Content-Type':'text/html;charset=utf-8'});
                res.write(writeInstrumentos(data))
                res.end()
            })
        }
        else{
            res.writeHead(404,{'Content-Type':'text/html;charset=utf-8'});
            res.end()
        }
    }
    else{
        res.writeHead(404,{'Content-Type':'text/html;charset=utf-8'});
        res.end()
    }
});

myserver.listen(4000);
console.log("Servidor à escuta na porta 4000....")
