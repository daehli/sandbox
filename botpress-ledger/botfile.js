module.exports = {

  /**
  * where the content is stored
  * you can access this property from `bp.dataLocation`
  */

  dataDir: process.env.BOTPRESS_DATA_DIR || './data',

  modulesConfigDir: process.env.BOTPRESS_CONFIG_DIR || './modules_config',
  disableFileLogs: false,
  port: process.env.BOTPRESS_PORT || process.env.PORT || 3000,
  optOutStats: false,
  notification: {
    file: 'notifications.json',
    maxLength: 50
  },
  log: {
    file: 'bot.log',
    maxSize: 1e6 // 1mb
  },

  /**
  * Access control of admin panel
  */
  login: {
    enabled: process.env.NODE_ENV === 'production',
    tokenExpiry: '6 hours',
    password: process.env.BOTPRESS_PASSWORD || 'password',
    maxAttempts: 3,
    resetAfter: 5 * 60 * 10000 // 5 minutes
  },

  /**
  * Postgres configuration
  */
  // postgres://{user}:{password}@{hostname}:{port}/{database-name}
  postgres: {
    enabled: process.env.DATABASE === 'postgres',
    host: process.env.PG_HOST || '127.0.0.1',
    port: process.env.PG_PORT || 5432,
    user: process.env.PG_USER || '',
    password: process.env.PG_PASSWORD || '',
    database: process.env.PG_DB || '',
    ssl: process.env.PG_SSL || true
  },

  url: process.env.URL_BASE, // set URL_BASE=""
  access_token : process.env.ACCESS_TOKEN, // set ACCESS_TOKEN

  // Messenger Configuration
  config:{
    'botpress-messenger':{
      persistentMenu: true,
      persistentMenuItems:[
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
      ],


      greetingMessage:'Tools to manage the outgo of a freelancer',
      accessToken: process.env.ACCESS_TOKEN,
      appSecret: process.env.APP_SECRET,
      applicationID: process.env.APPLICATION_ID,
      hostname:process.env.HOSTNAME,
      trustedDomains:[
        process.env.URL_BASE.toString(),
        "https://ledger.localtunnel.me/",
        "https://my-accounting-pal.herokuapp.com",
      ],
      chatExtensionHomeUrl:{
        "url":process.env.URL_BASE.toString(),
        "webview_height_ratio":"tall",
        "in_test":true
      }
    }
  }
}
