var util = require('util')

module.exports = function(bp){
  const db_helper = require('../src/helper/database')(bp)

  const router = bp.getRouter('botpress-ledger',{
    auth:(req) => req.method.toLowerCase() === 'post'
  })

  router.get("/form_outgo",(err,res)=>{
    res.render('index.ejs',{ title:"Ledger Bot",action:"outgo" })
  })

  router.get("/form_categories",(err,res)=>{
    res.render('index.ejs',{ title:"Set Categories",action:"categories" })
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

  router.delete("/categories/:catID",(req,res)=>{
    res.setHeader('Content-Type','application/json')
    db_helper.deleteIdCategory(req.params.catID,(err,data)=>{
      if(err){
        bp.logger.info(err)
        res.sendStatus(400)
      } else {
        res.sendStatus(200)
      }
    })
  })

  router.post("/categories/add",(req,res)=>{
    db_helper.addCategory(req.body,(err,data)=>{
      if(err){
        res.sendStatus(400)
      } else {
        res.setHeader('Content-Type','application/json')
        res.sendStatus(200)
      }
    })
  })

  // API pour ajouter un Outgo
  router.post("/big_book",(req,res)=>{
    db_helper.addRegister(req.body,(err,data)=>{
      if (err) {
        bp.logger.info(err)
        res.sendStatus(400)
      } else {
        console.log(data)
        res.sendStatus(200)
      }
    })
  })
}
