var express = require('express')
var router = express.Router()

router.get('/login', (req, res, next) => {
  res.send('its an login page')
})

router.get('/signup', (req, res, next) => {
  res.send('its an signup page')
})

module.exports = router
