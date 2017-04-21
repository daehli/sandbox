var chrono = require('chrono-node');
const BotpressBot = require('botpress-botkit').BotpressBot
const botkitConf = require('botpress-botkit').config;

module.exports = function(bp,controller) {

  // Contient les quick_replies. Le Greeting, Getting Starter, etc
  var facebook = require('./facebook_setup')(bp)

  // validate_requests: true,debug:true,receive_via_postback: true

  var controller = BotpressBot(bp,{});
  var bot = controller.spawn({});
  controller.startTicking()


  // On peut utilisé une array ou une string séparer par des virgules
  // ['message_received','postback'] ou 'message_received,postback'

  controller.hears(['ADD_CATEGORY 1'],'message_received',function(bot,message){
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
      }
    })
    // bp.events.emit("add_category","Food");
  })

  // Question sur le postback
  controller.on('postback',(bot,message)=>{

    if(message.text.toString() === "ADD_CATEGORY"){
      bot.startConversation(message,function(err,convo){
        // console.log(typeof(err));
        // console.log("ADD_CATEGORY Convo")
        // if(err === null){
        //   var category = "";
        //   convo.addQuestion('You are going to add a Category for helping you. Just tape your new category',function(resp,convo){
        //       console.log(resp);
        //       category = resp.text.toString();
        //       bp.events.emit("add_category",resp.text.toString());
        //       convo.next();
        // },{},'First')
        //   convo.say(message,'We just added ' + category + ' to the Database');
        // }
        // else {
        //   bp.logger.debug("Error ! " + err);
        // }
        convo.say("I\"m chatting with you !");
        convo.ask("You are going to add a Category for helping you. Just tape your new category",function(resp,convo){
          convo.say("Super !");
          console.log(resp);
          convo.next();
        });
        convo.say("I\"am out of the discussion");
      })
      // bp.events.emit("add_category","Food");
    }
  })
  //
  // controller.on('facebook_postback',(bot,message)=>{
  //   console.log('facebook_postback')
  // })
  //
  // controller.on('message_received,facebook_postback',(bot,message)=>{
  //   console.log('message_received,facebook_postback');
  // })
  //
  // controller.on('message_received,postback',(bot,message)=>{
  //   console.log('message_received,postback');
  // })

  // bp.hear({type:'postback',platform:'facebook',text:/ADD_CATEGORY/i},(event,next)=>{
  //   console.log("hear + postback");
  // })

  bp.hear({
    type: 'postback',
    text: /START/i,
    platform:'facebook'
  }, (event, next) => {
    var first_name = event.user.first_name;
    var last_name = event.user.last_name;
    console.log("PostBack Received.");
    bp.logger.info('New user:', first_name, last_name)
    // Creation of the users for the First time.
    var data = {
      id: event.user.id,
      platform: "facebook",
      gender: event.user.gender,
      timezone: event.user.timezone,
      locale: event.user.locale,
      picture_url: event.user.profile_pic,
      last_name: event.user.last_name,
      first_name: event.user.first_name
    }
    bp.messenger.sendText(event.user.id,"I'm Ledger-Bot. I was build to help Freelancer to track their outgo easily.")

    bp.db.saveUser(data)
    .then(knex=>{
      console.log("Just create a New Users");
    })
    .catch(err=>{
      console.log(bp.db.logger(err));
    });
    next();
  })

  bp.hear({text:/Review/i,platform:"facebook",type:"payload"},(event,next)=>{

    bp.messenger.sendText(event.user.id,"You have made a request to get Amount Delivery");

    // Code for generating pdf Data inside

  })

  bp.hear({text:'HELP_MENU_WHY',platform:'facebook',type:'quick_reply'},(event,next)=>{
    bp.messenger.sendText(event.user.id,`It's was build to help the freelancer. Freelancer don't worry about the outgo(probably a lot). This tool help to register the outgo easily.`,{typing:true});
    //    user:
    // { first_name: 'Daehli',
    //   last_name: 'Nadeau Otis',
    //   profile_pic: 'https://scontent.xx.fbcdn.net/v/t31.0-1/921014_10200225933063814_2018525756_o.jpg?oh=e8ce3e0bb197eb04f08ea1946d7bdd1f&oe=5984BD3B',
    //   locale: 'fr_CA',
    //   timezone: 2,
    //   gender: 'male',
    //   id: '1372516699453816' },


    // bp.db.get()
    // .then(knex=>{
    //   knex('users').where('userId',event.user.id.toString())
    //   .then(users=> console.log(users));
    // })
    // bp.db.createTableIfNotExists("users",(id)=>{
    //     console.log(id);
    // })
  })

  bp.hear({text:'HELP_MENU_EXEMPLE',platform:'facebook',type:'quick_reply'},(event,next)=>{

    bp.messenger.sendText(event.user.id,`Alpha test: probably this session with change during the developpement.`,{typing:true})
    .then(()=>{
      // Delay Here
      bp.messenger.sendText(event.user.id,`Give a simple description of your outgo. Give a least the date and the outgo. If you want you can give a picture.`,{typing:true})
      .then(()=>{
        // Delay Here
        bp.messenger.sendText(event.user.id,`Trip to Montreal 17/04/2017 115.00`)
        .then(()=>{
          // Delay Here
          bp.messenger.sendText(event.user.id,`$---$`)
          .then(()=>{
            // Delay Here
            bp.messenger.sendText(event.user.id,`This line say you have finish to give the outgo.`);
          })
        })
      })
    })
  })


  bp.hear({text:'HELP_MENU_CATEGORIE',platform:"facebook",type:"quick_reply"},(event)=>{

    bp.messenger.sendText(event.user.id,"You are going to add a Category for helping you. Just tape your new category.")
    .then((event)=>{
      bp.hear({text:/(.*)/i,platform:"facebook",text:"message"},(event)=>{
        console.log(event.text);
      })
      console.log("Bot Bot");
    })
  })


  bp.hear({text:/menu/i,platform:'facebook',type:'message'},(event,next)=>{

    bp.messenger.sendText(event.user.id,`Start giving some outgo`)
  })

  bp.hear({text:/help/i,platform:'facebook',type:'message'},(event,next)=>{

    bp.messenger.sendText(event.user.id,"Alpha release of Ledger-Bot:\n Ledger-Bot help you to track your outgo. It was specificaly built for freelancer.",facebook.sentence)
  })


  bp.hear({text:/(.*)/i,platform:'facebook',type:'message'},(event,next)=>{
    // Use case:
    // Trip to Montreal 17/04/2017  gaz 115.00 epicerie 15.40
    // Gaz Montreal -> 115.00 $ Yesterday
    // Parse Time-First

    // Work Around for pass a event who is handling first by botkit.


    if (controller.tasks[0] === undefined){
      var knex = bp.db.get().then(knex=>{
        knex.schema.createTableIfNotExists("categorie_type",table=>{
          table.increments('id').primary();
          table.string("category");
          table.timestamps();
        })
        .then(res=>{console.log("categorie_type \n " + res)})
        .catch(err=>{bp.logger.info(err)})
        knex.schema.createTableIfNotExists('big_book',table=>{
          table.increments().primary();
          table.string("descriptor");
          table.float("amount",2);
          table.date("date");
          table.integer('categorie_id').unsigned();
          table.foreign('categorie_id').references('categorie_type.id')
        })
        .then(res=>{console.log(res)})
        .catch(err=>{bp.logger.info(err)})
      })

      var heared = event.text;
      var time = chrono.parse(heared);

      if(time.length <= 0){
        throw "Invalid parse time";
        next();
      }

      if(time[0].text!==undefined){
        var strTime = time[0].text.toString();
        // Check for 2 dates
        var next = heared.replace(time[0].text.toString(),"");
      }
      else {
        console.log("You have not giving time !");
        next();
      }


      // Parse Cash second
      var cashReg = /(\d+(\s|,))*\d+((?=(\.|,))(.?)|())\d{1,2}/gi;
      // Ma regex ne prend pas le cas du nombre comme ça 1,000,000,88
      // Les derniers sont des décimal avec une virgule.

      var match = next.match(cashReg);
      var sum = 0;
      if(match !== null){
        for(var fullGroup of match){
          if (fullGroup !== undefined) {
            // Remplacer la virgule
            var str = fullGroup.toString()
            var length = str.length
            if(str[length-3]===","){
              str = str.split("");
              str[length-3] = "."
              str = str.join("");
            }
            var repla = fullGroup.replace(",","");
            next = next.replace(fullGroup.toString(),"");
            sum += parseFloat(repla);
          }
        }
      }
      else {
        // Bientot à jour
        bp.messenger.sendText(event.user.id,"I don't find your amount. Can you give me your amount explitly ?")
        .then(()=>{
          console.log(parse);
        })
      }
      // Parse Description Last

      var description = "";

      description = next;


      bp.messenger.sendText(event.user.id,"BotParse : Description : "+ description.toString() + " Time : " + strTime + " Amount : " + sum.toString());
    }
    else{
      console.log("BotKit is doing a task : It's a Work around to prevent botpress to overlap task to botkit");
    }
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
  bp.middlewares.load()


}
