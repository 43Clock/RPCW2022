var http = require("http");
var axios = require("axios");
var fs = require("fs");
var static = require("./static.js");
var { parse } = require("querystring");

function recuperaInfo(request, callback) {
  if (request.headers["content-type"] == "application/x-www-form-urlencoded") {
    let body = "";
    request.on("data", (bloco) => {
      body += bloco.toString();
    });
    request.on("end", () => {
      callback(parse(body));
    });
  }
}

function createDone(data) {
  str = "";
  data.forEach((ele) => {
    str += `<li class="w3-display-container w3-border w3-round">
                    <div>
                        <p><b>${ele.nome} (${ele.tipo})</b></p>
                        <p>${ele.descricao}</p>
                        <p>Até ${ele.data}, a ser feita por ${ele.pessoa}</p>    
                    </div>
                    <a class="w3-button w3-red w3-round w3-tiny" href="http://localhost:7777/tasks/delete/${ele.id}">&times</a>
                </li>`;
  });
  return str
}

function createNotDone(data) {
  str = "";
  data.forEach((ele) => {
    str += `<li class="w3-display-container w3-border w3-round">
                    <div>
                        <p><b>${ele.nome} (${ele.tipo})</b></p>
                        <p>${ele.descricao}</p>
                        <p>Até ${ele.data}, a ser feita por ${ele.pessoa}</p>    
                    </div>
                    <a class="w3-button w3-blue w3-round w3-tiny" href="http://localhost:7777/tasks/edit/${ele.id}"><i class="fa-solid fa-pencil"></i></a>
                    <a class="w3-button w3-green w3-round w3-tiny" href="http://localhost:7777/tasks/complete/${ele.id}"><i class="fa-solid fa-check"></i></i></a>
                </li>`;
  });
  return str
}

var galunoServer = http.createServer(function (req, res) {
  // Logger: que pedido chegou e quando
  var d = new Date().toISOString().substring(0, 16);
  console.log(req.method + " " + req.url + " " + d);

  if (static.recursoEstatico(req)) {
    static.sirvoRecursoEstatico(req, res);
  } else {
    switch (req.method) {
      case "GET":
        // GET /alunos --------------------------------------------------------------------
        if (req.url == "/tasks") {
          fs.readFile("index.html", (err, index) => {
            if (err) throw "index not found";
            var template = index.toString("utf-8");
            axios.get("http://localhost:3000/tasks?estado=pending")
              .then((response) => {
                var tarefas = response.data;
                let pending = createNotDone(tarefas);
                template = template.replace("${pending}", pending);
                axios.get("http://localhost:3000/tasks?estado=complete")
                  .then((response) => {
                    var tarefas = response.data;
                    let complete = createDone(tarefas);
                    template = template.replace("${complete}", complete);
                    template = template.replace("${edit}","")
                    template = template.replace("${titulo}","To Do List")
                    template = template.replace("${butao}","Registar")
                    template = template.replace("${cor}","teal")
                    res.writeHead(200, {"Content-Type": "text/html;charset=utf-8",});
                    res.write(template);
                    res.end();
                  })
                  .catch(function (erro) {
                    res.writeHead(200, {"Content-Type": "text/html;charset=utf-8",});
                    res.write("<p>Não foi possível obter a lista de tarefas...");
                    res.end();
                  });
              })
              .catch(function (erro) {
                res.writeHead(200, {"Content-Type": "text/html;charset=utf-8",});
                res.write("<p>Não foi possível obter a lista de tarefas...");
                res.end();
              });
          });
        }
        else if (/\/tasks\/edit\/[0-9]+$/.test(req.url)){
            var id = req.url.split("/")[3];
            fs.readFile("index.html", (err, index) => {
                if (err) throw "index not found";
                var template = index.toString("utf-8");
                axios.get("http://localhost:3000/tasks?estado=pending")
                  .then((response) => {
                    var tarefas = response.data;
                    let pending = createNotDone(tarefas);
                    template = template.replace("${pending}", pending);
                    axios.get("http://localhost:3000/tasks?estado=complete")
                      .then((response) => {
                        var tarefas = response.data;
                        let complete = createDone(tarefas);
                        template = template.replace("${complete}", complete);
                        template = template.replace("${edit}",`/edit/${id}`)
                        template = template.replace("${titulo}","Alterar Tarefa")
                        template = template.replace("${butao}","Alterar")
                        template = template.replace("${cor}","blue")
                        res.writeHead(200, {"Content-Type": "text/html;charset=utf-8",});
                        res.write(template);
                        res.end();
                      })
                      .catch(function (erro) {
                        res.writeHead(200, {"Content-Type": "text/html;charset=utf-8",});
                        res.write("<p>Não foi possível obter a lista de tarefas...");
                        res.end();
                      });
                  })
                  .catch(function (erro) {
                    res.writeHead(200, {"Content-Type": "text/html;charset=utf-8",});
                    res.write("<p>Não foi possível obter a lista de tarefas...");
                    res.end();
                  });
              });
        }
        else if (/\/tasks\/complete\/[0-9]+$/.test(req.url)){
            var id = req.url.split("/")[3];
            axios.get("http://localhost:3000/tasks/"+id)
                .then(response =>{
                    task = response.data
                    task["estado"] = "complete"
                    axios.put("http://localhost:3000/tasks/" +id,task)
                        .then(resp => {
                            res.writeHead(303, {'Location': '/tasks'});
                            res.end();
                        })
                })
        }
        else if (/\/tasks\/delete\/[0-9]+$/.test(req.url)) {
          var id = req.url.split("/")[3];
          axios.delete("http://localhost:3000/tasks/" + id)
            .then((response) => {
                res.writeHead(303, {'Location': '/tasks'});
                res.end();
            });
        }
        else {
          res.writeHead(200, { "Content-Type": "text/html;charset=utf-8" });
          res.write(
            "<p>" +
              req.method +
              " " +
              req.url +
              " não suportado neste serviço.</p>"
          );
          res.end();
        }
        break;
      case "POST":
        if (req.url == "/tasks") {
          recuperaInfo(req, (resultado) => {
            console.log("POST de tarefa: " + JSON.stringify(resultado));
            resultado["estado"] = "pending"
            axios.post("http://localhost:3000/tasks", resultado)
              .then((resp) => {
                res.writeHead(303, {'Location': '/tasks'});
                res.end();
              })
              .catch((erro) => {
                res.writeHead(200, {
                  "Content-Type": "text/html;charset=utf-8",
                });
                res.write("<p>Error no POST: " + erro + "</p>");
                res.end()
              });
          });
        }
        else if (/\/tasks\/edit\/[0-9]+$/.test(req.url)){
            var id = req.url.split("/")[3];
            recuperaInfo(req, (resultado) => {
                console.log("POST de tarefa: " + JSON.stringify(resultado));
                axios.get("http://localhost:3000/tasks/"+id)
                    .then(response =>{
                        let oldData = response.data
                        let newData = {}
                        for (const [key,value] of Object.entries(oldData)){
                            if (resultado[key] != "" && resultado[key])
                                newData[key] = resultado[key]
                            else
                                newData[key] = value
                        }
                        axios.put("http://localhost:3000/tasks/"+id, newData)
                            .then((resp) => {
                                res.writeHead(303, {'Location': '/tasks'});
                                res.end();
                            })
                            .catch((erro) => {
                                res.writeHead(200, {
                                "Content-Type": "text/html;charset=utf-8",
                                });
                                res.write("<p>Error no PUT: " + erro + "</p>");
                                res.end()
                            });
                    }).catch(function (erro) {
                        res.writeHead(200, {"Content-Type": "text/html;charset=utf-8",});
                        res.write("<p>Não foi possível alterar tarefa...");
                        res.end();
                      });
                })
                
        }
        break;
      default:
        res.writeHead(200, { "Content-Type": "text/html;charset=utf-8" });
        res.write("<p>" + req.method + " não suportado neste serviço.</p>");
        res.end();
    }
  }
});

galunoServer.listen(7777);
console.log("Servidor à escuta na porta 7777...");
