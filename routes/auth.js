import User from '../model/User.model'
import { registrationValidation, loginValidation } from '../validator/validator'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'

var express = require('express')
var router = express.Router()
dotenv.config({ path: './.env' })
router.post('/register', async (req, res) => {
  const { error } = registrationValidation(req.body)
  const emailExists = await User.findOne({ email: req.body.email })
  if (emailExists) return res.status(400).send('email already exists!!')
  if (error) return res.status(400).send(error.details[0].message)

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

router.post('login', async (req, res) => {
  const { error } = loginValidation(req.body)
  if (error) return res.status(400).send(error.details[0].message)
  const user = await User.findOne({ email: req.body.email })
  if (!user) return res.status(400).send('email not found')
  const validPass = await bcrypt.compare(req.body.password, user.password)
  if (!validPass) return res.status(400).send('incorrect password!!')
  const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET)
  res.header('authentication-token', token).send(token)
  res.send('logged in!!')
})

module.exports = router
