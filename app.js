import logger from 'morgan'
import express from 'express'
import createError from 'http-errors'
import path from 'path'
import cookieParser from 'cookie-parser'
// import indexRouter from './routes/index'
import usersRouter from './routes/users'
import mongo from 'mongodb'
import mongoose from 'mongoose'
import flash from 'connect-flash'
import session from 'express-session'
import passport from 'passport'
import expressValidator from 'express-validator'
import message from 'express-messages'
import { Strategy } from 'passport-local'
import multer from 'multer'
import dotenv from 'dotenv'
import expressLayouts from 'express-ejs-layouts'
import bodyParser from 'body-parser'
// var ejs = require('ejs')

// routes
import authRoute from './routes/auth'

// config
dotenv.config()

const app = express()
var db = 'mongodb://localhost/shop'
mongoose.connect(db, { useNewUrlParser: true })
  .then(() => console.log('database connected!!'))
  .catch(() => console.log('database is not connected'))

// middelware
app.use(bodyParser.json())
// app.use(bodyParser.urlencoded({
//   extended: true
// }))

app.use('/api/users', authRoute)
// app.use(expressLayouts)
// app.set('view engine', 'ejs')

// app.use('/', require('./routes/index'))
// app.use('/users', require('./routes/users'))

const Port = process.env.PORT || 3005

app.listen(Port, console.log(`server starts on ${Port}`))
