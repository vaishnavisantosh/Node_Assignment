var express = require('express')
var router = express.Router()

router.get('/', (req, res, next) => {
  res.render('index')
})

router.post('/login', (req, res, next) => {
  console.log(req.body)
  res.json(req.body)
})

router.post('/register', (req, res, next) => {
  res.json(req.body)
})
// router.get('/register', (req, res, next) => {
//   res.render('registration')
// })

module.exports = router
