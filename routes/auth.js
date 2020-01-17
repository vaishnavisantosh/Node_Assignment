import User from '../model/User.model'
import UserActivity from '../model/UserActivity.model'
import { registrationValidation, loginValidation } from '../validator/validator'
// import bcrypt from 'bcrypt'
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
  // const salt = bcrypt.genSaltSync(10)
  // const encryptedPass = bcrypt.hashSync(req.body.password, salt)
  const user = new User({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    // password: encryptedPass
    password:req.body.password
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
  // const validPass = await bcrypt.compare(req.body.password, user.password)
  // if (!validPass) return res.status(400).send('incorrect password!!')
  if (user.firstName==='admin') {
    isAdmin = true
  } else {
    isAdmin = false
  }
console.log(req.headers)
console.log(req.connection.remoteAddress)
  const userActivity=new UserActivity({
    userId: req._id,
    ipAddress:req.ip,
    uaString: req.headers['user-agent'],
    
  })
  try {
    const savedActivity = await userActivity.save()
    res.send(savedActivity)
  } catch (err) {
    res.status(400).send(err)
  }
 const token = jwt.sign({ _id: user._id, isAdmin: isAdmin }, process.env.TOKEN_SECRET)
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

router.get('/useractivity',async(req,res)=>{
  let date = new Date();
    dt = date.setDate(date.getDate() - process.env.INACTIVEDAYS)
    console.log(dt)
  // const response=await UserActivity.find({loginDate: {$lt: dt}}).populate('users').exec()
  // console.log(response)
  // return res.status(200).send(response)
})

router.patch('/users/:id',async (req, res) => {
  console.log(req)
  const updateObject = req.body;
  console.log(updateObject)
   await User.update({ _id: req.params.id }, { $set: updateObject} , (err, updatedEmp) => {
      if (err) {
        console.log('error occured!!!!')
      } else {
        res.status(204)
      }
    })
  })

module.exports = router
