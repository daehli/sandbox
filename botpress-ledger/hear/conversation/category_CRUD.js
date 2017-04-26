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
        payload: 'List_CATEGORY'
      }
    ],
    typing:true
  }

  const txt = txt => bp.messenger.createText(event.user.id,txt,{typing:true});

  const quick = (message,quick_reply)  => bp.messenger.createText(event.user.id,"What you want to do ?",quick_reply);

  bp.hear({type:"message",platform:"facebook",text:/ADD_CATEGORY/i},(event,next)=>{



    bp.convo.start(event,convo=>{

      convo.threads['default'].addMessage(txt("You are able to modify, delete, listed and add a category to ledger-bot"))
      convo.threads['default'].addMessage(quick("What you want to do ?",categorie)
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
    )
    })
  })

  bp.hear({type:"quick_reply",platform:"facebook",text:/ADD_CATEGORY/i},(event,next)=>{
    console.log("ADD")
    bp.convo.start(event,convo=>{

      bp.threads['default'].addQuestion()


    })
  })

  bp.hear({type:"quick_reply",platform:"facebook",text:/ADD_UPDATE/i},(event,next)=>{

  })

  bp.hear({type:"quick_reply",platform:"facebook",text:/ADD_DELETE/i},(event,next)=>{

  })

  bp.hear({type:"quick_reply",platform:"facebook",text:/ADD_LIST/i},(event,next)=>{

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

}
