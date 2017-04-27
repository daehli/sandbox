var chrono = require('chrono-node');

module.exports = function(bp){
  // Première intéraction avec le bot.
  bp.hear({
    type: 'postback',
    text: /START/i,
  }, (event, next) => {
    var first_name = event.user.first_name;
    var last_name = event.user.last_name;
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

    bp.db.saveUser(data)
    .then(knex=>{
      console.log("Just create a New Users");
    })
    .catch(err=>{
      console.log(bp.db.logger(err));
    });

    const txt = txt => bp.messenger.createText(event.user.id,txt,{typing:true});

    bp.convo.start(event,convo=> {
      convo.threads['default'].addMessage(txt("Hi, I'm Ledger-Bot. I'm here to help peoples track their outgo easily."))
      convo.threads['default'].addQuestion(txt("Do you want to try Ledger-Bot ?"),[
        // Yes
        {
          pattern: /yes|y|why not|yep|go|go for it/i,
          callback:()=>{
            convo.say(txt("First of all, you need to have some outgo to register. For the exemple, we will enter only fictive data."))
            convo.switchTo('First_exemple_description');
          }
        },
        // no
        {
          pattern: /no|n|nop|stop/i,
          callback:()=>{
            convo.say(txt("Ok, I you want to came back later you can type first_time."))
            convo.stop('Cancel')
          }
        },
        {
          default:true,
          callback:()=>{
            convo.say(txt("Sorry I don't understand"))

            convo.switchTo("Try Again");
          }
        }

      ])

      // Threads
      convo.createThread("First_exemple_description");
      convo.threads["First_exemple_description"].addQuestion(txt("Give me a simple description of your outgo e.q (Trip to New York) 4 characters min"),[
        {
          pattern:/(.{4,})/i,
          callback:(response)=>{
            convo.say(txt("You gave a good description. I'm proud of you."))
            convo.set('description',response.match)
            convo.switchTo("First_exemple_amount")
          }
        },
        {
          default:true,
          callback:()=>{
            convo.say(txt("I don't understand !"));
            convo.switchTo("First_exemple_description");
          }
        }
      ])
      convo.createThread("First_exemple_amount");
      convo.threads["First_exemple_amount"].addQuestion(txt("Please give me your amount of your outgo"),[
        {
          pattern:/(\d+(\s|,))*\d+((?=(\.|,))(.?)|())\d{1,2}/i,
          callback:(response)=>{
            var str = response.text.toString()
            var length = str.length
            // 10,00 si virgule avec 2 decimals
            if(str[length-3]===","){
              str = str.split("");
              str[length-3] = "."
              str = str.join("");
            }
            // 10,0 si virgule avec 1 decimal
            else if (str[length-2]===",") {
              str = str.split("")
              str[length-2] = "."
              str = str.join("");
            }
            convo.set('amount',parseFloat(str))
            convo.switchTo("First_exemple_date")
          }
        },
        {
          default:true,
          callback:()=>{
            convo.say(txt("I don't understand your amount !"));
            convo.switchTo("First_exemple_amount");
          }
        }
      ])
      convo.createThread("First_exemple_date");
      convo.threads["First_exemple_date"].addQuestion(txt("Please give me the date of the outgo."),[
        {
          pattern:/(.{4,})/i,
          callback:(response)=>{
            var date = chrono.parse(response.match);
            if(date[0].text !== undefined){
              var strTime = date[0].text.toString();
              convo.set("time",strTime);
              convo.switchTo("First_exemple_category");
            }
            else{
              convo.say(txt("I was not enable to understand your date."));
              convo.switchTo("First_exemple_date")
            }
          }
        },
        {
          default:true,
          callback:()=>{
            convo.say(txt("I don't understand your date."));
            convo.switchTo("First_exemple_date");
          }
        }
      ])

      convo.createThread("First_exemple_category");
      convo.threads["First_exemple_category"].addQuestion(txt("Could you give me a category to describe your outgo ? (e.q : Trip,Food,business trip)"),[
        {
          pattern:/(.{3,})/i,
          callback:(response)=>{
            convo.set("category",response.match)
            convo.next();
            // convo.switchTo("done");
          }
        },
        {
          default:true,
          callback:()=>{
            convo.say(txt("I don't understand your category. Probably your categorie is too short."));
            convo.switchTo("First_exemple_category");
          }
        }
      ])

      // convo.createThread("done")
      convo.on('done',()=>{
        convo.say(txt("Great, It's simple like this to add a outgo in ledger-bot."))
        convo.say(txt(`Your outgo was: Description : ${convo.get("description")} Amount : ${convo.get("amount")} Date : ${convo.get("time")} Category : ${convo.get("category")}`))
        convo.next()
      })

      convo.on('More_explication',()=>{
        convo.say(txt("You can type \"help\" to receive more information about botpress"))
        convo.say(txt("You should add some category to Ledger-Bot. You can click on the side menu to make some action."))
        convo.stop("cancel");
      })
      // convo.threads["done"].addMessage(txt("Great, It's simple like this to add a outgo in ledger-bot."))
      // convo.threads["done"].addMessage(txt(`Your outgo was: Description : ${convo._cache["description"]} Amount : ${convo._cache["amount"]} Date : ${convo._cache["time"]} Category : ${convo._cache["category"]}`))
      convo.createThread("Try Again");
      convo.threads["Try Again"].addQuestion(txt("Do you want to try again ?"),[
        {
          pattern:/yes|y|why not|yep|go|go for it/i,
          callback:()=>{
            convo.switchTo("default")
          }
        },
        {
          pattern:/no|n|nop|stop/i,
          callback:()=>{
            convo.stop('cancel')
          }
        },
        {
          default:true,
          callback:()=>{
            convo.say(txt("You can type \"stop\" if you want to stop the conversation"));

            convo.switchTo("default")
          }
        }
      ])

      convo.on('cancel',()=>{
        convo.say(txt("Bye Bye"))
      })

      convo.on(/stop|done/i,()=>{
        convo.say(txt("This conversation is over. Bye bye"))
      })
    })
  })
}
