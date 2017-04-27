module.exports= function(bp){

  const categorie = {
    quick_replies: [
      {
        content_type: 'text',
        title: 'Add',
        payload: 'ADD_CATEGORY'
      },
      {
        content_type: 'text',
        title: 'Delete',
        payload: 'DELETE_CATEGORY'
      },
      {
        content_type: 'text',
        title: 'Update',
        payload: 'UPDATE_CATEGORY'
      },
      {
        content_type: 'text',
        title: 'List',
        payload: 'LIST_CATEGORY'
      }
    ],
    typing:true
  }


  bp.hear({type:"message",platform:"facebook",text:/MENU_CATEGORY/i},(event,next)=>{

    const txt = txt => bp.messenger.createText(event.user.id,txt,{typing:true});

    const quick = (message,quick_reply)  => bp.messenger.createText(event.user.id,message,quick_reply);


    // Il faut que je passe par cette fonction pour toucher au autres hears
    bp.messenger.sendText(event.user.id,"You are able to modify, delete, listed and add a category to ledger-bot",{typing:true})
    .then(()=>{
      bp.messenger.sendText(event.user.id,"What you want to do ?",categorie)
    })


    // Je vais demander au gars c'est quoi le problème.
    //
    // var begin = bp.convo.start(event)
    //
    // begin.threads['default'].addMessage(txt("You are able to modify, delete, listed and add a category to ledger-bot"))
    // begin.threads['default'].addMessage(quick("What you want to do ?",categorie))
    // ,[
    // {
    //   pattern:/Add/i,
    //   callback:(response)=>{
    //     console.log("ADD")
    //     let cat = response.text;
    //     bp.events.emit("add_category",cat.toString());
    //
    //   }
    // },
    // {
    //   pattern:/DELETE_CATEGORY/i,
    //   type:"postback",
    //   callback:(response)=>{
    //
    //   }
    // },
    // {
    //   pattern:/UPDATE_CATEGORY/i,
    //   type:"postback",
    //   callback:()=>{
    //
    //   }
    // },
    //   {
    //     default:true,
    //     callback:()=>{
    //       convo.next()
    //     }
    //   }
    // ]
  })


  bp.hear({type:"quick_reply",platform:"facebook",text:/ADD_CATEGORY/i},(event,next)=>{

    const txt = txt => bp.messenger.createText(event.user.id,txt,{typing:true});

    let add  = bp.convo.create(event)

    add.activate();
    // convo.activate();
    add.threads['default'].addQuestion(txt("What's the name of your Category to add ?"),[
      {
        pattern:/.{3,}/i,
        callback:(resp)=>{
          console.log(resp.text)
          // I can ask to save
          bp.events.emit("add_category",resp.text);
          add.say(txt("Great, I add " + resp.text + " to your personnals categories."))
          add.next()
        }
      },
      {
        default:true,
        callback:()=>{
          add.say(txt("I don't understand your category. Your category should be at least 3 characters."))
          add.switchTo("default");
        }
      }
    ])
  })

  bp.hear({type:"quick_reply",platform:"facebook",text:/UPDATE_CATEGORY/i},(event,next)=>{
    const txt = txt => bp.messenger.createText(event.user.id,txt,{typing:true});

    const quick = (message,quick_reply)  => bp.messenger.createText(event.user.id,"What you want to do ?",quick_reply);


  })

  bp.hear({type:"quick_reply",platform:"facebook",text:/DELETE_CATEGORY/i},(event,next)=>{

    const txt = txt => bp.messenger.createText(event.user.id,txt,{typing:true});

    var del = bp.convo.create(event)
    del.createThread("DELETE")
    del.switchTo("DELETE");
    del.activate();
    del.threads['DELETE'].addQuestion(txt("Name your category to delete."),[
      {
        pattern:/.{3,}/i,
        callback:(response)=>{
          var data = ids("categories_type",response.text,del)
          console.log(response.text);
          del.set("name",response.text);
          del.switchTo("confirmation")
          // }
          // else{
          //   del.say(txt("Oups Your category doesn't exist please try again"))
          //   del.switchTo("DELETE");
          // }
          // bp.events.emit("delete_category",response.text);
        }
      },
      {
        default:true,
        callback:()=>{
          del.say(txt("I cannot understand your category"))
          del.switchTo("default");
        }
      }
    ])

    del.createThread("confirmation")
    del.threads["confirmation"].addQuestion(txt(`Do you want to delete ${del._cache.name}`),[
      {
        pattern:/yes|y|yop|for sure/i,
        callback:()=>{
          delete_category("categories_type",del.get("id"));
          del.next();
        }
      },
      {
        pattern:/no|nop|n/i,
        callback:()=>{
          del.say(txt("Ok, I will kept your category."))
          del.next();
        }
      }
    ])
  })

  bp.hear({type:"quick_reply",platform:"facebook",text:/LIST_CATEGORY/i},(event,next)=>{

    const txt = txt => bp.messenger.createText(event.user.id,txt,{typing:true});

    const quick = (message,quick_reply)  => bp.messenger.createText(event.user.id,"What you want to do ?",quick_reply);

    list = bp.convo.create(event);

    list.createThread("list")
    list.switchTo("list");
    list.activate()

    list.threads['list'].addQuestion(txt("Do you want to see your categories lists ?"),[
    {
        pattern:/yes|y|yop|yep|y/i,
        callback:()=>{
            getList(list,txt)
        }
    },
    {
        pattern:/no|nop|n/i,
        callback:()=>{

            list.say(txt("Perfert, I will not show you your categories list"))
            list.next();
        }
    },
    {
        default:true,
        callback:()=>{
            list.say(txt("I don't understand what you mean."))
            list.switchTo("list")
        }
    }
    ])
  })


  const getList = (conversation,txt)=>{
    bp.db.get()
    .then(knex=>{
        return knex("categories_type").select()
    })
    .then(thx=>{
        let count = 0;
        for(row of thx){
            //conversation.set("type_"+count,row.name)
            //count++;
            conversation.say(txt(`Name : ${row.name}`))
        }
        conversation.next()
    })

  }

  const ids = (table,name,convo)=> {
    bp.db.get()
    .then(knex=>{
      return knex(table).where({"name":name}).select("id")
      .returning("id")
      .then(thx=>{
        console.log(thx);
        if(thx.length === 1){
          convo.set("id",thx[0].id);
        }
        else{
          bp.logger.info("They have a problem in the Database")
        }
      })
    })
  }

  const delete_category = (table,id) => {
    bp.db.get()
    .then(knex=>{
      return knex(table).del().where({"id":id})
    })
    .then((row)=>{
    })
  }

  bp.events.on("add_category",data=>{
    // Transaction into the DB
    var obj = bp.db.get()
    .then(knex=>{
      knex("categories_type").insert({"name":data})
      .returning('id')
      .then(thx=>{console.log("Add Category " + thx )})
    })
  })

  bp.events.on("delete_category",data=>{
    // Transaction into the DB
    bp.db.get()
    .then(knex=>{
      knex('categories_type').where({category:data}).select("id")
      .then(thx=>{console.log("Id : " + thx)})
    })
  })
}
