var Request = require('request')

module.exports = function (bp) {

  const sentence = {

    quick_replies: [
      {
        content_type: 'text',
        title: 'Why Ledger-Bot',
        payload: 'HELP_MENU_WHY'
      },
      {
        content_type: 'text',
        title: 'Add Categorie',
        payload: 'HELP_MENU_CATEGORIE'
      }
    ],
    typing: true
  }


  var url = ""
  var environnement = bp.db.kvs.get("__config")
  .then(knex=>{
    url = 'https://graph.facebook.com/v2.6/me/messenger_profile?access_token='
     + knex["botpress-messenger"]["accessToken"]
    var env = {}
    env["accessToken"] = knex["botpress-messenger"]["accessToken"]
    env["verifyToken"] = knex["botpress-messenger"]["verifyToken"]
    // Payload quand on appuie sur le getting Started
    var getting_starter = {
      "get_started": {
        "payload":"START"
      }
    }
    Request.post(url, { form: getting_starter }, function (err, response, body) {
      if (err) {
        console.log(err)
      } else {
        console.log('Getting started', body)
      }
    })
    // Texte qui explique le bot. Très sommairement
    var greeting_text = {
      "greeting":[
        {
          "locale":"default",
          "text":"Hi, I\'m LedgerBot. "
        },
        {
          "locale":"en_US",
          "text":"Tools to manage the outgo of a freelancer"
        }
      ]
    }
    Request.post(url, { form: greeting_text }, function (err, response, body) {
      if (err) {
        console.log(err)
      } else {
        console.log('greetings added', body)
      }
    })
    // Le menu de persisance
    var persistent_menu = {
      "persistent_menu":[
        {
          "locale":"default",
          "call_to_actions":[
            {
              "title":"Menu category",
              "type":"nested",
              "call_to_actions":[
                {
                  "title":"Bot Categories",
                  "payload":"MENU_CATEGORY",
                  "type":"postback"
                },
                {
                  "title":"GUI Categories",
                  "type":"web_url",
                  "url": process.env.URL_BASE.toString() + "api/botpress-ledger/form_categories",
                  "webview_height_ratio": 'tall',
                  "messenger_extensions": true,
                }
              ]
            },
            {
              "title":"Add outgo",
              "type":"nested",
              "call_to_actions":[
                {
                  "title": "Quick outgo",
                  "type" : "postback",
                  "payload":"QUICK_OUTGO"
                },
                {
                  "title": "Add outgo",
                  "type" : "postback",
                  "payload":"ADD_OUTGO"
                },
                {
                  "type": 'web_url',
                  "title": 'Set Outgo_GUI',
                  "url": process.env.URL_BASE.toString() + "api/botpress-ledger/form_outgo",
                  "webview_height_ratio": 'tall',
                  "messenger_extensions": true,
                }
              ]
            }
          ]
        }
      ]
    }
    Request.post(url, { form: persistent_menu }, function (err, response, body) {
      if (err) {
        console.log(err)
      } else {
        console.log('Add persistent_menu', body)
      }
    })

    // Chat extensions
    var whitelist = {
      "whitelisted_domains":[
        process.env.URL_BASE.toString(),
        "https://ledge.localtunnel.me/",
        "https://my-accounting-pal.herokuapp.com",

      ]
    }
    Request.post(url,{ form:whitelist },function(err,response,body){
      if(err){
        bp.logger.debug(err)
      } else {
        console.log("Add WhiteList ",body)
      }
    })


    // Drawer for the apps
    var home_url = {
      "url":process.env.URL_BASE,
      "webview_height_ratio":"tall",
      "in_test":true
    }

    Request.post(url,{ form:home_url },function(err,response,body){
      if(err){
        bp.logger.debug(err)
      } else{
        console.log("Add Drawer",body)
      }
    })
    return env
  })


  var getConfig = function(){
    var instance = bp.db.kvs.get("__config")
    .then((knex)=>{
      return knex
    })

    return instance
  }

  return {
    sentence:sentence,
    environnement:environnement,
    getConfig:getConfig
  }
}
