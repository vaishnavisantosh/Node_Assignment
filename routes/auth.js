import User from '../model/User.model'
import { registrationValidation, loginValidation } from '../validator/validator'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'

var express = require('express')
var router = express.Router()
dotenv.config({ path: './.env' })

// router.get('/', (req, res, next) => {
//   res.render('index')
// })

// router.get('/dashboard', (req, res, next) => req.header)
router.post('/register', async (req, res) => {
  const { error } = registrationValidation(req.body)
  const emailExists = await User.findOne({ email: req.body.email })
  if (emailExists) return res.status(400).send('email already exists!!')
  if (error) return res.status(400).send(error.details[0].message)
  // if (error) {
  //   res.render('index', { error, firstName, lastName, email, password })
  // }

  const salt = bcrypt.genSaltSync(10)
  const encryptedPass = bcrypt.hashSync(req.body.password, salt)
  const user = new User({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    password: encryptedPass
  })
  try {
    const savedUser = await user.save()
    res.send(savedUser)
  } catch (err) {
    res.status(400).send(err)
  }
})

router.post('/login', async (req, res) => {
  let isAdmin
  const { error } = loginValidation(req.body)
  if (error) return res.status(400).send(error.details[0].message)
  const user = await User.findOne({ email: req.body.email })
  if (!user) return res.status(400).send('email not found')
  const validPass = await bcrypt.compare(req.body.password, user.password)
  if (!validPass) return res.status(400).send('incorrect password!!')
  const checkAdmin = user.findOne({ firstName: 'admin' })
  if (checkAdmin) {
    isAdmin = true
  } else {
    isAdmin = false
  }
  // checkAdmin ? isAdmin = true : isAdmin = false
  const token = jwt.sign({ _id: user._id, isAdmin: isAdmin }, process.env.TOKEN_SECRET)
  // localStorage.setItem('auth-token', token)
  // res.send()

  res.header('authentication-token', token).send('logged in!!')
})

router.get('/dashboard', async (req, res) => {
  // console.log(req.headers.authorization)
  let users
  const token = req.headers.authorization
  if (!token) return res.status(401).send('Access denied')
  try {
    const decodedToken = jwt.verify(req.headers.authorization, process.env.TOKEN_SECRET)
    if (decodedToken.isAdmin) {
      users = await User.find()
    } else {
      users = await User.find({ _id: decodedToken._id })
    }

    res.status(200).send(users)
    console.log(decodedToken)
  } catch (err) {
    return res.send('invalid Token')
  }
})

module.exports = router
