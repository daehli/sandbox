var chrono = require('chrono-node')

module.exports = function(bp){
  const db_helper = require("./../helper/database")(bp)

  bp.hear({ type:"postback",text:"QUICK_OUTGO" },(event,next)=>{

    const txt = txt => bp.messenger.createText(event.user.id,txt,{ typing:true })
    const quick = (message,quick_reply) => bp.messenger.createText(event.user.id,message,quick_reply)

    var list = { quick_replies:[] }
    var convo = bp.convo.create(event)

    convo.messageTypes = ['quick_reply','message','image']
    convo.activate()
    convo.threads['default'].addQuestion(txt("Enter your complete outgo."),[
      {
        pattern:/(.{10,})/i,
        callback: (response)=>{
          // Use case:
          // Trip to Montreal 17/04/2017  gaz 115.00 epicerie 15.40
          // Gaz Montreal -> 115.00 $ Yesterday
          // Parse Time-First

          var heared = response.text
          var time = chrono.parseDate(heared)

          if(time!==null){
            var strTime = time.toString()
            // Check for 2 dates
            convo.set("time",strTime)
            var next = heared.replace(time.toString(),"")
          } else {
            convo.switchTo("quick_time")
            console.log("You have not giving time !")
          }


          // Parse Cash second
          var cashReg = /(\d+(\s|,))*\d+((?=(\.|,))(.?)|())\d{1,2}/gi
          // Ma regex ne prend pas le cas du nombre comme ça 1,000,000,88
          // Les derniers sont des décimal avec une virgule.

          var match = next.match(cashReg)
          var sum = 0
          if(match !== null){
            for(var fullGroup of match){
              if (fullGroup !== undefined) {
                // Remplacer la virgule
                var str = fullGroup.toString()
                var length = str.length
                // 10,00 si virgule
                if(str[length-3]===","){
                  str = str.split("")
                  str[length-3] = "."
                  str = str.join("")
                } else if (str[length-2]===",") {
                  // 10,0 si virgule
                  str = str.split("")
                  str[length-2] = "."
                  str = str.join("")
                }
                var repla = fullGroup.replace(",","")
                next = next.replace(fullGroup.toString(),"")
                sum += parseFloat(repla)
              }
            }
            convo.set("sum",sum)
          } else {
            convo.switchTo("quick_amount")
          }
          // Parse Description Last

          var description = ""

          description = next

          convo.set("description",description)


          done(list,function(err,result){
            if(err){
              bp.logger.debug(err)
              convo.stop()
            }
            if(result !== undefined){
              convo.switchTo("quick_choice")
            }
          })
        }
      },
      {
        default:true,
        callback:()=>{
          convo.say("I don\'t understand what you have saied.")
          convo.next()
        }
      }

    ])

    convo.createThread("quick_choice")
    convo.threads["quick_choice"].addQuestion(quick("Choice your category",list),[
      {
        pattern:/\d/i,
        callback:(response)=>{
          convo.set("choice",response.text)
          convo.switchTo("image")
        }
      },
      {
        default:true,
        callback:()=>{
          convo.say(txt("I don't understand what is going on."))
          convo.next()
        }
      }
    ])

    convo.createThread("image")
    convo.threads["image"].addQuestion(txt("Do you want to add a picture"),[
      {
        pattern:/yes|yop|y|yep/i,
        callback:()=>{
          convo.switchTo("image_url")
        }
      },
      {
        pattern:/no|nop|n/i,
        callback:()=>{
          var data = {
            descriptor:convo.get("description"),
            amount:convo.get("amount"),
            date:convo.get("time"),
            categorie_id:convo.get("choice")
          }
          db_helper.addRegister(data,(err,result)=>{
            if(err){
              bp.logger.info(err)
              convo.stop("error")
            }
            convo.stop('done')
          })
        }
      }
    ])

    convo.createThread("image_url")
    convo.threads["image_url"].addQuestion(txt("Could you send me your picture."),[
      {
        pattern:/https/i,
        callback:(resp)=>{
          convo.set("image_url",resp.text)
          console.log(resp.text)
          var data = {
            descriptor:convo.get("description"),
            amount:convo.get("amount"),
            date:convo.get("time"),
            image_url:convo.get("image_url"),
            categorie_id:convo.get("choice")
          }
          db_helper.addRegister(data,(err,result)=>{
            if(err){
              bp.logger.info(err)
              convo.stop("error")
            }
            convo.stop('done')
          })
        }
      },
      {
        default:true,
        callback:()=>{
          convo.say(txt("I don\'t understand"))
        }
      }
    ])

    convo.createThread("quick_time")
    convo.threads["quick_time"].addQuestion(txt("Could you please give me your date ?"),[
      {
        pattern:/.{7,}/i,
        callback:(response)=>{
          var date = chrono.parse(response.match)
          if(date[0].text !== undefined){
            var strTime = date[0].text.toString()
            convo.set("time",strTime)
            convo.next()
          }
          convo.say(txt("I was not enable to understand your date."))
          convo.switchTo("qui")
        }
      },
      {
        default:true,
        callback:()=>{
          convo.say(txt("I don\'t understand what you meets."))
          convo.switchTo("quick_time")
        }
      }
    ])

    convo.createThread("quick_amount")
    convo.threads['quick_amount'].addQuestion(txt("Could you be more precise in your description for your amount ?"),[
      {
        pattern:/(\d+(\s|,))*\d+((?=(\.|,))(.?)|())\d{1,2}/i,
        callback:(response)=>{
          var str = response.text.toString()
          var length = str.length
          // 10,00 si virgule avec 2 decimals
          if(str[length-3]===","){
            str = str.split("")
            str[length-3] = "."
            str = str.join("")
          } else if (str[length-2]===",") {
            // 10,0 si virgule avec 1 decimal
            str = str.split("")
            str[length-2] = "."
            str = str.join("")
          }
          convo.set('amount',parseFloat(str))
          convo.next()
        }
      },
      {
        default:true,
        callback:()=>{
          convo.say(txt("I don't understand your amount !"))
          convo.switchTo("quick_amount")
        }
      }
    ])

    convo.on('done',()=>{
      convo.say(txt("I add this outgo to your books"))
    })

    bp.hear({text:/(.{115,})/i,platform:'facebook',type:'message'},(event,next)=>{


      bp.messenger.sendText(event.user.id,"BotParse : Description : " + description.toString() + " Time : " + strTime + " Amount : " + sum.toString())

      // Faire plustard le lien avec les catégories.
      //
      // var data = {
      //   descriptor:description,
      //   amount:sum,
      //   date:Date.parse(strTime)
      // }
      //
      // // Refactoring
      // bp.db.get()
      // .then(knex=>{
      //   knex("big_book").insert(data)
      //   .returning('id')
      //   .then((res)=>{console.log("Add Category " + res)})
      //   .catch(err=>{bp.db.logger(err)})
      // })
    })
  })

  const add_quick_reply = (title,payload)=>{
    var obj =
      {
        content_type: 'text',
        title:title,
        payload:payload
      }
    return obj
  }

  const done = (list,callback)=>{
    db_helper.getList(function(err,data){
      if(err){
        bp.logger.debug(err)
      }
      for(let ele of data){
        let obj = add_quick_reply(ele.name,ele.id)
        list.quick_replies.push(obj)
      }
      if(list.quick_replies[0]!== undefined){
        callback(null,list)
      } else{
        callback(null)
      }
    })
  }

}
