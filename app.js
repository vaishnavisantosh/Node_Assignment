import logger from 'morgan'
import express from 'express'
import createError from 'http-errors'
import path from 'path'
import cookieParser from 'cookie-parser'
import indexRouter from './routes/index'
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
import { createServer } from 'http'

dotenv.config()

const app = express()

app.use('/', require('./routes/index'))
app.use('/user', require('./routes/users'))

const Port = process.env.PORT || 5000

app.listen(Port, console.log(`server starts on ${Port}`))
