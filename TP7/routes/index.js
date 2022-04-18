const { default: axios } = require('axios');
var express = require('express');
var router = express.Router();
var apikey = "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYyNGNiYTg0OWJhYmI2NjdjYmZkYzE2ZSIsImlhdCI6MTY0OTE5NTY1MiwiZXhwIjoxNjUxNzg3NjUyfQ.EuvH713Qr6IZ073-5FMF6j5p_3tb6Trv0TOOF5ZHWOPUlCBqKU1H9DTo_ueoCyWhPbEd6F8xzNvn-UkG3J8Ppq65xF8uukoElnSIsi3kldXI2E_EHMv5ETIq-2SGpiBmLyv1zu2broi-nXw18XwKM-WWpoumw5mZacg1qyj4kokGm--WzPIDD15Uibu2ObsDfeHpbDt81Npq-WgEVe56F5w0TdAvY_b-Xvm77hXI4MuaatL9bsOtYEyiepLuBelDyVWjAIoon3-7tB1lwrPnC0OJ_cxKUyCdqx8sZPkmciyTmBsV8fDTyvTP1ibiryAQsDRK5TrG83CcWmStZyDnoQ"

/* GET home page. */
router.get('/', function(req, res) {
    let params = {
      apikey: apikey,
      estrutura: "arvore",
      nivel: 1
    }
    axios.get("http://clav-api.di.uminho.pt/v2/classes",{params:params})
        .then(data=>{
          res.render("index",{classes:data.data})
        })
        .catch(erro=>res.render("error",{error:erro}))
});


router.get("/:id",function(req,res) {
  let params = {
    apikey: apikey
  }
  axios.get("http://clav-api.di.uminho.pt/v2/classes/"+req.params.id,{params:params})
      .then(data=>{
        if (data.data.nivel != 3){
          res.render("classe",{data:data.data})
        } else {
            axios.get("http://clav-api.di.uminho.pt/v2/classes/"+req.params.id+"/procRel",{params:params})
                .then(rel=>{
                  let words = ["eCruzadoCom", "eComplementarDe", "eSuplementoDe","eSuplementoPara"]
                  let filtered = rel.data.filter(ele=>words.includes(ele.idRel))
                  res.render("classe3",{data:data.data,rel:filtered})
                })
                .catch(erro=>res.render("error",{error:erro}))


        }
      })
      .catch(erro=>res.render("error",{error:erro}))
})

module.exports = router;
