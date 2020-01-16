// import logger from 'morgan'
import express from 'express'
// import createError from 'http-errors'
import path from 'path'
// import cookieParser from 'cookie-parser'
import mongoose from 'mongoose'
// import flash from 'connect-flash'
// import session from 'express-session'
// import expressValidator from 'express-validator'
// import message from 'express-messages'
// import multer from 'multer'
import dotenv from 'dotenv'
import bodyParser from 'body-parser'

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
app.use(bodyParser.urlencoded({
  extended: true
}))

// Serve static files. CSS, Images, JS files ... etc
// app.use(express.static(path.join(__dirname, 'public')))

// Template engine. PUG
// app.set('views', path.join(__dirname, 'views'))
// app.set('view engine', 'pug')

app.use('/', authRoute)
// app.get('/dashboard', (req, res) => { 'hi' })
// app.use((req, res, next) => {
//   var err = new Error('Page not found')
//   err.status = 404
//   next(err)
// })

// Handling errors
app.use((err, req, res, next) => {
  res.status(err.status || 500)
  res.send(err.message)
})

const Port = process.env.PORT || 5000

app.listen(Port, console.log(`server starts on ${Port}`))
