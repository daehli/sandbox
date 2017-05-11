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

  var getConfig = function(){
    var instance = bp.db.kvs.get("__config")
    .then((knex)=>{
      return knex
    })

    return instance
  }

  return {
    sentence:sentence,
    getConfig:getConfig
  }
}
