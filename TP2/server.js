var http = require('http');
var fs = require("fs")
var url = require("url")


myserver = http.createServer(function (req,res){
    var myurl = url.parse(req.url,true).pathname
    console.log(myurl)
    if (myurl.includes("/filmes")){
        if(myurl == "/filmes"){
            fs.readFile("./htmls/index.html",(err,data) => {
                res.writeHead(200,{'Content-Type':'text/html;charset=utf-8'});
                if(err){
                    res.write("<p>Erro na leitura do ficherio...</p>")
                }else{
                    res.write(data)
                }
                res.end()
            })
        }
        else {
            movie = myurl.split("/")[2]
            fs.readFile("./htmls/"+movie+".html",(err,data) => {
                res.writeHead(200,{'Content-Type':'text/html;charset=utf-8'});
                if(err){
                    res.write("<p>Erro na leitura do ficherio...</p>")
                }else{
                    res.write(data)
                }
                res.end()
            })
        }
    }
    else if (myurl.includes("/atores")){
        if(myurl == "/atores"){
            fs.readFile("./htmls/atores.html",(err,data) => {
                res.writeHead(200,{'Content-Type':'text/html;charset=utf-8'});
                if(err){
                    res.write("<p>Erro na leitura do ficherio...</p>")
                }else{
                    res.write(data)
                }
                res.end()
            })
        }
        else {
            ator = myurl.split("/")[2]
            fs.readFile("./htmls/"+ator+".html",(err,data) => {
                res.writeHead(200,{'Content-Type':'text/html;charset=utf-8'});
                if(err){
                    res.write("<p>Erro na leitura do ficherio...</p>")
                }else{
                    res.write(data)
                }
                res.end()
            })
        }
  
    }
});

myserver.listen(7777);
console.log("Servidor à escuta na porta 7777....")

/*
Ler json
    - Gerer pagina html para cada registo
Criar Servidor para Servir as paginas
    - localhost:xxxx/filmes/f1
                           /f2
localhost:xxxx/filmes
    Lista de titulos por ordem alfabetica
    index.html
        28 days
        <a href="localhost:xxxx/filmes/f2">28 Days</a>*/