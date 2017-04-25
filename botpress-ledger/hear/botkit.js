// const BotpressBot = require('../../fork/botpress-botkit/src/index')
// const BotpressBot = require('botpress-botkit').BotpressBot;

module.exports = function(bp,env){


  env.environnement
  .then(result=>{
    var controller = BotpressBot(bp,{
      debug: true,
      access_token: result.accessToken,
      verify_token: result.verifyToken,
      validate_requests: true,
      receive_via_postback: true
    },"facebook");
    var bot = controller.spawn({});
    controller.startTicking()

    // console.log(controller);


    // 152a2ba7-5b07-4d0e-b76f-c1cd364be89d

  // On peut utilisé une array ou une string séparer par des virgules
  // ['message_received','postback'] ou 'message_received,postback'


  controller.hears(['ADD_CATEGORY'],'postback',function(bot,message){
    console.log(message.text.toString());

    bot.startConversation(message,function(err,convo){
      if(!err){
        var category = "";
        convo.ask('You are going to add a Category for helping you. Just tape your new category',function(resp,convo){
          console.log(resp);
          category = resp.text.toString();
          bp.events.emit("add_category",resp.text.toString());
          convo.next();
        })
        convo.say(message,'We just added ' + category + ' to the Database');
      }
      else {
        bp.logger.debug("Error !" + err);
        convo.next();
      }
    })
    // bp.events.emit("add_category","Food");
  })

  // // Question sur le postback
  // controller.on('postback',(bot,message)=>{
  //
  //   if(message.text.toString() === "ADD_CATEGORY"){
  //     bot.startConversation(message,function(err,convo){
  //       // console.log(typeof(err));
  //       // console.log("ADD_CATEGORY Convo")
  //       // if(err === null){
  //       //   var category = "";
  //       //   convo.addQuestion('You are going to add a Category for helping you. Just tape your new category',function(resp,convo){
  //       //       console.log(resp);
  //       //       category = resp.text.toString();
  //       //       bp.events.emit("add_category",resp.text.toString());
  //       //       convo.next();
  //       // },{},'First')
  //       //   convo.say(message,'We just added ' + category + ' to the Database');
  //       // }
  //       // else {
  //       //   bp.logger.debug("Error ! " + err);
  //       // }
  //       convo.say("I\"m chatting with you !");
  //       convo.ask("You are going to add a Category for helping you. Just tape your new category",function(resp,convo){
  //         convo.say("Super !");
  //         console.log(resp);
  //         convo.next();
  //       });
  //       convo.say("I\"am out of the discussion");
  //     })
  //     // bp.events.emit("add_category","Food");
  //   }
  // })

  bp.events.on("add_category",data=>{
    // Transaction into the DB
    console.log(data);
    bp.db.get()
    .then(knex=>{
      knex("categorie_type").insert({category:data})
      .returning('category')
      .then(thx=>{console.log("Add Category " + thx )})
    })
  })


  return controller;
  })
}
