var chrono = require('chrono-node');

const sentence = {

  quick_replies: [
    {
      content_type: 'text',
      title: 'Why Ledger-Bot',
      payload: 'HELP_MENU_WHY'
    },
    {
      content_type: 'text',
      title: 'Exemple of Use',
      payload: 'HELP_MENU_EXEMPLE'
    }
    },
    {
      content_type: 'text',
      title: 'Add Categorie',
      payload: 'HELP_MENU_CATEGORIE'
    }
  ],
  typing: true

}

module.exports = function(bp) {
  bp.middlewares.load()

  bp.hear({
    type: 'postback',
    text: /START/i,
    platform:'facebook'
  }, (event, next) => {
    var first_name = event.user.first_name;
    var last_name = event.user.last_name;
    bp.logger.info('New user:', first_name, last_name)
    next();
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
    })
    .catch(err=>{
      console.log(err)
    });

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



  bp.hear({text:/menu/i,platform:'facebook',type:'message'},(event,next)=>{

    bp.messenger.sendText(event.user.id,`Start giving some outgo`)
  })

  bp.hear({text:/help/i,platform:'facebook',type:'message'},(event,next)=>{

    bp.messenger.sendText(event.user.id,"Alpha release of Ledger-Bot:\n Ledger-Bot help you to track your outgo. It was specificaly built for freelancer.",sentence)
  })

  bp.hear({text:''})

  bp.hear({text:/(.*)/i,platform:'facebook',type:'message'},(event,next)=>{

    // Use case:
    // Trip to Montreal 17/04/2017  gaz 115.00 epicerie 15.40
    // Gaz Montreal -> 115.00 $ Yesterday
    // Parse Time-First


    var knex = bp.db.get().then(knex=>{
      console.log(knex);
      knex.schema.createTable('c')
    })

    var heared = event.text;
    var time = chrono.parse(heared);

    if(time[0].text!==undefined){
      var strTime = time[0].text.toString();
      // Check for 2 dates
      var next = heared.replace(time[0].text.toString(),"");
    }
    else {
      // handling the date
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
      bp.messenger.sendText(event.user.id,"I don't find your amount. Can you give me your amount explitly ?")
      .then(()=>{
        console.log(parse);
      })
    }
    // Parse Description Last

    var description = "";

    description = next;

    bp.messenger.sendText(event.user.id,"BotParse : Description : "+ description.toString() + " Time : " + strTime + " Amount : " + sum.toString());

  })
}
