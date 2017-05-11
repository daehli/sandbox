var chrono = require('chrono-node')

module.exports = function(bp) {

  const facebook = require('./facebook_setup')(bp)
  const setup_db = require('./db_setup')(bp)
  var first_time = require('./conversation/getting_started')(bp)
  var category_CRUD = require('./conversation/category_CRUD')(bp)
  var add_outgo = require('./conversation/register_with_question')(bp)
  var quick_outgo = require('./conversation/register')(bp)
  var router = require('./../routes/registration')(bp)


  bp.hear({ text:/Review/i,platform:"facebook",type:"payload" },(event,next)=>{
    bp.messenger.sendText(event.user.id,"You have made a request to get Amount Delivery")

    // Code for generating pdf Data inside

  })

  // bp.hear({ text:/add_category/i,type:"message",platform:"facebook"},(event,next)=>{
  //   console.log("add_category")
  // })

  bp.hear({ text:'HELP_MENU_WHY',platform:'facebook',type:'quick_reply' },(event,next)=>{
    bp.messenger.sendText(event.user.id,`It's was build to help the freelancer.Freelancer don't worry about/
     the outgo(probably a lot). This tool help to register the outgo easily.`,{ typing:true })
  })

  bp.hear({ text:'HELP_MENU_EXEMPLE',platform:'facebook',type:'quick_reply' },(event,next)=>{

    bp.messenger.sendText(event.user.id,`Alpha test: probably this session with change during the \
      developpement.`,{ typing:true })
    .then(()=>{
      // Delay Here
      bp.messenger.sendText(event.user.id,`Give a simple description of your outgo. Give a \
        least the date and the outgo. If you want you can give a picture.`,{ typing:true })
      .then(()=>{
        // Delay Here
        bp.messenger.sendText(event.user.id,`Trip to Montreal 17/04/2017 115.00`)
        .then(()=>{
          // Delay Here
          bp.messenger.sendText(event.user.id,`$---$`)
          .then(()=>{
            // Delay Here
            bp.messenger.sendText(event.user.id,`This line say you have finish to give the outgo.`)
          })
        })
      })
    })
  })


  bp.hear({ text:'HELP_MENU_CATEGORIE',platform:"facebook",type:"quick_reply" },(event)=>{

    bp.messenger.sendText(event.user.id,"You are going to add a Category for helping you. Just tape your new category.")
    .then((event)=>{
      bp.hear({ text:/(.*)/i,platform:"facebook",text:"message" },(event)=>{
        console.log(event.text)
      })
      console.log("Bot Bot")
    })
  })

  bp.hear({ text:/menu/i,platform:'facebook',type:'message' },(event,next)=>{

    bp.messenger.sendText(event.user.id,`Start giving some outgo`)
  })

  bp.hear({ text:/help/i,platform:'facebook',type:'message' },(event,next)=>{
    bp.messenger.sendText(event.user.id,"Alpha release of Ledger-Bot:\n Ledger-Bot help you to track your outgo. \
    It was specificaly built for freelancer.",facebook.sentence)
  })

  bp.middlewares.load()
}
