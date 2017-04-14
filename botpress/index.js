const BotpressBot = require('botpress-botkit').BotpressBot

module.exports = function(bp) {
  var controller = BotpressBot(bp,{});
  var bot = controller.spawn({});
  controller.startTicking()

  controller.hears(['oui','non','bien sure'],'message_received',function(bot,message){

    bot.startConversation(message,function(err,convo){
      if(!err){
        convo.say('Je suis propulsé par le module botpress-botkit');
        convo.ask('J\'aimerais savoir votre nom ?',function(resp,convo){
          if(resp.text.toString().toLowerCase() === resp.raw.user.first_name.toString().toLowerCase()){
            convo.ask('Félicitation vous connaissez votre nom ! ')
            convo.next();
          }
          else {
            bp.messenger.sendText(convo.context.user,'Vous vous croyez malin mon ami. Vous n\'êtes pas celui que vous prétendez être...' + resp.raw.user.first_name,{typing:true});
            convo.next();
          }
          convo.ask('Est-ce que vous êtes intéressé à savoir quel type de personnalité êtes vous ? ',function(resp,convo){
            console.log("\n yolo \n");

            if(/oui/i.test(resp.text.toString()) || /yes/i.test(resp.text.toString())|| /surement/i.test(resp.text.toString())){

              var payload = {
                'template_type':'generic',
                'elements':[
                  {
                    'title':'Personnalité',
                    'image_url':'https://fr.wikipedia.org/wiki/Test_de_personnalit%C3%A9#/media/File:Lavater1792.jpg',
                    'subtitle':'Test',
                    'buttons':[
                      {
                        'type':'web_url',
                        'url':'https://www.16personalities.com/fr/test-de-personnalite',
                        'title':'Découvre toi !'
                      },
                      {
                        'type':'web_url',
                        'url':'https://www.16personalities.com/fr/test-de-personnalite',
                        'title':'Découvre toi !'
                      }
                    ]
                  }
                ]
              }

              bp.messenger.sendTemplate(convo.context.user,payload);
              convo.next();
            }
            else {
              var payload = {
                'template_type': 'generic',
                'elements': [
                  {
                    'title':'Wiki',
                    'image_url':'https://fr.wikipedia.org/wiki/Test_de_personnalit%C3%A9#/media/File:Lavater1792.jpg',
                    'subtitle':'Connaissance',
                    'buttons':[
                      {
                        'type': 'web_url',
                        'url': 'https://fr.wikipedia.org/wiki/Test_de_personnalit%C3%A9',
                        'title': 'Un super lien'
                      }
                    ]
                  }
                ]
              }
              bp.messenger.sendText(convo.context.user,'Vous n\'êtes vraiment pas curieux ! Peut-être qu\'une petite lecture te fera du bien.');
              bp.messenger.sendTemplate(convo.context.user,payload);
              convo.next();
            }
            convo.say('J\'ai terminé de perdre mon temps avec toi! Bonne Journée')
          })
        })
        convo.next();
      }
    })
  })


  bp.hear(/hello/i, (event, next) => { // We use a regex instead of a hardcoded string
    const first_name = event.user.first_name

    bp.messenger.sendText(event.user.id, 'Hello', { typing: true })
  })

  bp.hear(/((s|ç|c)a(.|)va)/i,(event,next)=>{

    // Si on envoi aucun texte il fait un erreur.
    // bp.messenger.sendText(event.user.id);
    bp.messenger.sendText(event.user.id, 'Bien sûre et vous ?');
  })

  bp.hear(/Que fait tu ?/i,(event,next)=>{
    bp.messenger.sendText(event.user.id,'Je vais des tests pour Botpress. J\'aimerais avoir votre nom ?',{waitRead:true})
    .then(()=>{
      console.log('LOL');
    })
    // Je voulais piper plusieur hear, faire semblait de faire une discution.
    console.log('test');
    bp.hear({text:/(.*)/i,platform:'facebook',type:'message'},(event,next)=>{
      if(event.user.first_name===event.text){
        bp.messenger.sendText(event.user.id,'Félicitaion vous savez vous nom :+1: !');
      }
      bp.messenger.sendText(event.user.id,'Vous vous amuser à changer votre nom. Je vous connais plus que vous le croyez ' + event.user.first_name,{typing:true});
    })
  })



  // Dans le skype de jeudi 13 avril. Pour recevoir seulement les évènements message. On doit spécifier le type:'message' et non type:'text'.
  // bp.hear({text:/(.*)/i,platform:'facebook',type:'message'},(event,next)=>{
  //   const first_name = event.user.first_name;
  //
  //   // J'ai pas trouvé l'api pour sendText
  //   bp.messenger.sendText(event.user.id, first_name + ' vous avez dit ! ' + event.text, {typing:true})
  // })

  bp.middlewares.load()


}
// Ce que je peux catcher dans le event.${}
// platform: 'facebook',
// type: 'message',
// user: profile,
// text: e.message.text,
// raw: e
