require('dotenv').config()

module.exports = {
  "repository": "@specifyapp/Seeds",
  "personalAccessToken": process.env.SPECIFY_KEY,
  "rules": [
    {
      "name": "Seeds",
      "path": "./tests/seeds.json",
      "parsers": []
    }
  ]
}
