import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import User from '../model/User.model';
import UserActivity from '../model/UserActivity.model';
import { registrationValidation, loginValidation } from '../lib/validator';

dotenv.config({ path: './.env' });
