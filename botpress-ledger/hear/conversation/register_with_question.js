var chrono = require('chrono-node');

module.exports = function(bp){
  // Première intéraction avec le bot.
  bp.hear({
    type: 'message',
    text: /ADD_OUTGO/i,
  }, (event, next) => {

    const txt = txt => bp.messenger.createText(event.user.id,txt,{typing:true});

    const quick = (message,quick_reply)  => bp.messenger.createText(event.user.id,message,quick_reply);

    var list = {quick_replies:[]}
    var handler = [];

    var conversation = bp.convo.create(event)
    conversation.messageTypes = ['quick_reply','message']

    // Threads
    conversation.createThread("description");
    conversation.switchTo("description")
    conversation.activate()
    conversation.threads["description"].addQuestion(txt("Give me a simple description of your outgo"),[
      {
        pattern:/(.{4,})/i,
        callback:(response)=>{
          if (response.text.length > 15){
            conversation.say(txt("You gave a good description. I'm proud of you."))
            conversation.set('description',response.match)
            // Get the list of Category_type before the call
            getList((err,data)=>{
              if(err){
                bp.logger.debug(err);
                conversation.stop("error");
              }
              for(ele of data){
                let obj = add_quick_reply(ele.name,ele.id);
                list.quick_replies.push(obj);
                handler.push(question_pattern(ele.id));
              }
            });
            conversation.switchTo("amount")
          }
          else{
            conversation.say(txt("Good one !"))
            getList((err,data)=>{
              if(err){
                bp.logger.debug(err);
                return;
              }
              for(ele of data){
                let obj = add_quick_reply(ele.name,ele.id);
                list.quick_replies.push(obj);
                handler.push(question_pattern(ele.id));
              }
            });
            conversation.set('description',response.match)
            conversation.switchTo("amount")
          }
        }
      },
      {
        default:true,
        callback:()=>{
          conversation.say(txt("I don't understand !"));
          conversation.switchTo("description");
        }
      }
    ])
    conversation.createThread("amount");
    conversation.threads["amount"].addQuestion(txt("Please give me your amount of your outgo"),[
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
          conversation.set('amount',parseFloat(str))
          conversation.switchTo("date")
        }
      },
      {
        default:true,
        callback:()=>{
          conversation.say(txt("I don't understand your amount !"));
          conversation.switchTo("amount");
        }
      }
    ])
    conversation.createThread("date");
    conversation.threads["date"].addQuestion(txt("Please give me the date of the outgo."),[
      {
        pattern:/(.{4,})/i,
        callback:(response)=>{
          var date = chrono.parseDate(response.match);
          if(date !== undefined){
            var strTime = date.toString();
            conversation.set("time",strTime);
            conversation.switchTo("category");
          }
          else{
            conversation.say(txt("I was not enable to understand your date."));
            conversation.switchTo("date")
          }
        }
      },
      {
        default:true,
        callback:()=>{
          conversation.say(txt("I don't understand your date."));
          conversation.switchTo("date");
        }
      }
    ])

    conversation.createThread("category");
    conversation.threads["category"].addQuestion(quick("Choice your Categories.",list),[
      {
        pattern:/\d/i,
        callback:(response)=>{
          conversation.set("choice",response.text)
          var data = {
            descriptor:conversation.get("description"),
            amount:conversation.get("amount"),
            date:conversation.get("time"),
            categorie_id:conversation.get("choice")
          }
          addRegister(data,(err,result)=>{
            if(err){
              bp.logger.info(err)
              conversation.stop("error");
            }
            conversation.stop('done');
          });
        }
      },
      {
        default:true,
        callback:()=>{
          conversation.say(txt("I don't understand what is going on."))
          conversation.next();
        }
      }
    ])

    // conversation.createThread("done")
    conversation.on('done',()=>{
      conversation.say(txt("I add this outgo to your books"))
      conversation.stop("cancel");
    })

    conversation.on('More_explication',()=>{
      conversation.say(txt("You can type \"help\" to receive more information about botpress"))
      conversation.say(txt("You should add some category to Ledger-Bot. You can click on the side menu to make some action."))
      conversation.stop("cancel");
    })
    // convo.threads["done"].addMessage(txt("Great, It's simple like this to add a outgo in ledger-bot."))
    // convo.threads["done"].addMessage(txt(`Your outgo was: Description : ${convo._cache["description"]} Amount : ${convo._cache["amount"]} Date : ${convo._cache["time"]} Category : ${convo._cache["category"]}`))
    conversation.createThread("Try Again");
    conversation.threads["Try Again"].addQuestion(txt("Do you want to try again ?"),[
      {
        pattern:/yes|y|why not|yep|go|go for it/i,
        callback:()=>{
          conversation.switchTo("default")
        }
      },
      {
        pattern:/no|n|nop|stop/i,
        callback:()=>{
          conversation.stop('cancel')
        }
      },
      {
        default:true,
        callback:()=>{
          conversation.say(txt("You can type \"stop\" if you want to stop the conversation"));

          conversation.switchTo("default")
        }
      }
    ])

    conversation.on('error',()=>{
      conversation.say(txt("They have been a error during the registration"))
    })

    conversation.on('cancel',()=>{
      conversation.say(txt("Bye Bye"))
    })

    conversation.on(/stop|done/i,()=>{
      conversation.say(txt("This conversation is over. Bye bye"))
    })
  })


  const add_quick_reply = (title,payload)=>{
    var obj =
    {
      content_type: 'text',
      title:title,
      payload:payload
    }
    return obj;
  }

  const question_pattern = (pattern)=>{
    var obj =
    {
      pattern:/pattern/i,
      callback:(res)=>{
        console.log(res);
      }
    }
    return obj;
  }

  const getList = (callback) =>{
    callback = callback || function() {};
    bp.db.get()
    .then(knex=>{
      return knex("categories_type").select()
    })
    .map(row=>{
       return row;
    })
    .then(data=>{
      data = data || []
      callback(null,data);
    })
    .catch((err)=>{
      callback(err);
    })
  }

  const addRegister = (obj,callback) =>{
    obj = obj || {};
    bp.db.get()
    .then(knex=>{
      return knex.insert(
        {
          descriptor:obj.descriptor,
          amount:obj.amount,
          date:obj.date,
          categorie_id:obj.categorie_id
        }).into("big_book")
    })
    .map(row=>{
      console.log(row)
      return row;
    })
    .then(thx=>{
      console.log(thx);
      thx = thx || []
      callback(null,thx);
    })
    .catch(err=>{
      callback(err);
    })
  }

}
