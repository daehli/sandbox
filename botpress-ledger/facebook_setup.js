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
        title: 'Exemple of Use',
        payload: 'HELP_MENU_EXEMPLE'
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
  bp.db.kvs.get("__config")
  .then(knex=>{
    url = 'https://graph.facebook.com/v2.6/me/messenger_profile?access_token=' + knex["botpress-messenger"]["accessToken"]

    // Payload quand on appuie sur le getting Started
    var getting_starter = {
      "get_started": {
        "payload":"START"
      }
    }
    Request.post(url, {form: getting_starter}, function (err, response, body) {
      if (err) {
        console.log(err)
      }
      else {
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
    Request.post(url, {form: greeting_text}, function (err, response, body) {
      if (err) {
        console.log(err)
      }
      else {
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
              "title":"Add category",
              "type":"postback",
              "payload":"ADD_CATEGORY"
            },
            {
              "title":"Review",
              "type":"postback",
              "payload":"Review"
            }
          ]
        }
      ]
    }
    Request.post(url, {form: persistent_menu}, function (err, response, body) {
      if (err) {
        console.log(err)
      }
      else {
        console.log('Add persistent_menu', body)
      }
    })
  });

  return {
    sentence:sentence
  };
}
