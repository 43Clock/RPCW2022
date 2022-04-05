var express = require('express');
var router = express.Router();
var File = require('../controllers/file');
var multer = require('multer')
var upload = multer({dest: 'uploads'})
var fs = require('fs')


/* GET home page. */
router.get('/', function(req, res, next) {
  console.log(req)
  File.list()
  .then(data =>{
    res.render('index',{list:data})
  })
  .catch(err=>{
    res.render('error',{error:err})
  })
});

router.post("/",upload.single('ficheiro'),function(req,res) {
  var d = new Date().toISOString().substring(0,16)
  var oldPath = __dirname+"/../"+req.file.path
  var newPath = __dirname+"/../public/images/"+req.file.originalname

  fs.access(newPath,fs.F_OK,(notExists)=>{
    if (notExists){
      fs.rename(oldPath,newPath, erro =>{
        if (erro) throw erro
      })
    
      var file = {
        name:req.file.originalname,
        desc:req.body.desc,
        date:d,
        mimetype:req.file.mimetype,
        size:req.file.size
      }
      File.insert(file)
      .then(()=>res.redirect(301,"/"))
      .catch((erro)=>res.render('error',{error:erro}))
      return
    }
    res.redirect(301,"/")
  })
})

  

router.post("/delete/:id",(req,res)=>{
  var id = req.params.id
  File.lookUp(id)
    .then(data =>{
      var path = __dirname + '/../public/images/' + data.name
      fs.unlink(path, erro => {
        if(erro) res.render('error', {error:erro})
      })
    })
    .catch(erro => {res.render('error',{error:erro})})

  File.delete(req.params.id)
      .then(() => {res.redirect(301,'/')} )
      .catch(erro => {res.render('error',{error:erro})})
})

module.exports = router;
