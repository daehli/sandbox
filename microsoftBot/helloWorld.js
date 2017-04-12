var builder = require('botbuilder');

// Bot dans une console
var connector = new builder.ConsoleConnector().listen();
var bot = new builder.UniversalBot(connector);
var intents = new builder.IntentDialog();
// Maintenant les dialogue sont dirigé par les intentions
bot.dialog('/',intents);
// Si il veux avoir un changement
intents.matches(/^change user/i,[
  function(session){
    session.beginDialog('/profile');
  },
  function(session,results){
    session.send("New information Provided : Name %s \t age %s",session.userData.name,session.userData.age);
  }
])
// Le cas normal
intents.onDefault([
  function(session,args,next){
    if(!session.userData.name){
      session.beginDialog('/profile')
    }
    else {
      next();
    }
  },
  function(session,results){
    console.log(results);
    session.send('Hello %s et vous avez %s !',session.userData.name,session.userData.age);
  }
])

// Un Dialogue
bot.dialog('/profile',[
  function(session){
    builder.Prompts.text(session,'Quel est votre nom ?');
  },
  function(session,results,next){
    session.userData.name = results.response;
    next();
  },
  function(session){
    builder.Prompts.text(session,'Quel est votre Age ?');
  },
  function(session,results){
    console.log(results);
    session.userData.age = results.response;
    session.endDialog();
  }
])
