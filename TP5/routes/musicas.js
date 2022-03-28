var express = require('express');
var router = express.Router();
var axios = require("axios");
const { json } = require('express');

router.get('/', function(req, res, next) {
    axios.get("http://localhost:3000/musicas")
        .then((response) => {
          let musicas = response.data
          res.render("musicas",{musicas:musicas})
        })
        .catch((err)=>{
          res.render("error",{error:err})
        })
});

router.get("/inserir", function(req,res,next) {
  res.render('form')
})

router.get('/:id', function(req,res,next) {
    let id = req.params.id
    axios.get("http://localhost:3000/musicas/"+id)
        .then((response) => {
          let musica = response.data
          res.render("musica",{musica:musica})
        })
        .catch((err)=>{
          res.render("error",{error:err})
        })
})

router.get("/prov/:prov", function(req,res,next) {
    let prov = req.params.prov
    axios.get("http://localhost:3000/musicas?prov="+prov)
        .then((response) => {
          let musicas = response.data
          if (musicas.length > 0){
            res.render("musicasProv",{musicas:musicas,prov:prov})
          }
          else {
            res.render("musicasProvErr",{prov:prov})
          }
        })
        .catch((err)=>{
          res.render("error",{error:err})
        })
})

router.post("/", function(req,res,next) {
    console.log("POST de musica " +JSON.stringify(req.body))
    axios.post("http://localhost:3000/musicas",req.body)
        .then((response) => {
            res.redirect("/musicas")
        })
        .catch((err)=>{
          err["status"] = "Erro ao fazer POST da musica!"
          res.render("error",{error:err})
        })
})

module.exports = router;
