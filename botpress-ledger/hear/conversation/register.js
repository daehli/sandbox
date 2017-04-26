module.exports = function(bp){

  bp.hear({platform:"facebook",type:["postback","message"],text:"QUICK_OUTGO"},(event,next)=>{

    const txt = txt => bp.createTest(event.user,id,txt);

    bp.convo.start(event,convo=>{

      convo.threads['default'].addQuestion(txt("Just enter your complete outgo"),[
        pattern:/(.{20,})/i
        callback: (response)=>{
          // Use case:
          // Trip to Montreal 17/04/2017  gaz 115.00 epicerie 15.40
          // Gaz Montreal -> 115.00 $ Yesterday
          // Parse Time-First

          // Work Around for pass a event who is handling first by botkit.
          var heared = response.text;
          var time = chrono.parse(heared);

          if(time.length <= 0){
            convo.switchTo("quick_time");
          }

          if(time[0].text!==undefined){
            var strTime = time[0].text.toString();
            // Check for 2 dates
            convo.set("time",strTime)
            var next = heared.replace(time[0].text.toString(),"");
          }
          else {
            convo.switchTo("quick_time")
            console.log("You have not giving time !");
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
                // 10,00 si virgule
                if(str[length-3]===","){
                  str = str.split("");
                  str[length-3] = "."
                  str = str.join("");
                }
                // 10,0 si virgule
                else if (str[length-2]===",") {
                  str = str.split("");
                  str[length-2] = "."
                  str = str.join("");
                }
                var repla = fullGroup.replace(",","");
                next = next.replace(fullGroup.toString(),"");
                sum += parseFloat(repla);
              }
            }
            convo.set("sum",sum);
          }
          else {
            convo.switchTo("quick_amount");
          }
          // Parse Description Last

          var description = "";

          description = next;

          convo.set("description",description);

          // Le lien avec description. 

        },
        {
          default:true,
          callback:()=>{
            convo.say("I don\'t understand what you have saied.")
            convo.next();
          }
        }

      ])

      convo.createThread("quick_time")
      convo.threads["quick_time"].addQuestion(txt("Could you please give me your date ?"),[
        {
          pattern:/.{7,}/i,
          callback:(response)=>{
            var date = chrono.parse(response.match);
            if(date[0].text !== undefined){
              var strTime = date[0].text.toString();
              convo.set("time",strTime);
              convo.next();
            }
            convo.say(txt("I was not enable to understand your date."));
            convo.switchTo("qui")
          }
        },
        {
          default:true,
          callback:()=>{
            convo.say(txt("I don\'t understand what you meets."))
            conco.switchTo("quick_time")
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
            convo.next();
          }
        },
        {
          default:true,
          callback:()=>{
            convo.say(txt("I don't understand your amount !"));
            convo.switchTo("quick_amount");
          }
        }
      ])

    })

    bp.hear({text:/(.{115,})/i,platform:'facebook',type:'message'},(event,next)=>{


      bp.messenger.sendText(event.user.id,"BotParse : Description : "+ description.toString() + " Time : " + strTime + " Amount : " + sum.toString());

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

}
