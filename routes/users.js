var express = require('express')
var router = express.Router()

router.get('/login', (req, res, next) => {
  res.render('login')
})

router.get('/register', (req, res, next) => {
  res.render('registration')
})

module.exports = router
