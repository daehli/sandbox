var util = require('util')

module.exports = function(bp){
  const db_helper = require('../src/helper/database')(bp)
  const messenger = "/api/botpress-messenger"

  const router = bp.getRouter('botpress-messenger')

  router.get("/form",(err,res)=>{
    res.render('index.ejs',{ title:"GUI_DAEHLI" })
  })

  // API pour categories_type
  router.get("/categories",(err,res)=>{

    db_helper.getList((err,data)=>{
      var list = []
      if(err){
        bp.logger.info(err)
        return
      } else {
        for(let ele of data){
          list.push(ele)
        }
      }
      res.setHeader('Content-Type','application/json')
      res.send(JSON.stringify(list))
    })
  })

  router.get("/categories/:catID",(req,res)=>{
    db_helper.getIdCategory(req.params.catID,(err,data)=>{
      var ids = ""
      if (err) {
        bp.logger.info(err)
      } else {
        ids = data
      }
      res.setHeader('Content-Type','application/json')
      res.send(JSON.stringify(ids))
    })
  })

  // API pour ajouter un Outgo
  router.post("/big_book",(req,res)=>{
    console.log(req.body)
    res.send(util.inspect(req, { depth : 3 }))
    // res.send(util.inspect(req, { showHidden: true, depth: 5 }))
    //   db_helper.addRegister(req,(err,data)=>{
    //     var ids = "";
    //     if (err) {
    //       bp.logger.info(err)
    //     }
    //     else {
    //       ids = data
    //     }
    //   })
  })
}
