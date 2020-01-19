import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import User from '../model/User.model';
import UserActivity from '../model/UserActivity.model';
import { registrationValidation, loginValidation } from '../lib/validator';

dotenv.config({ path: './.env' });

const userController = {};

userController.signup= async(req, res)=>{

    const { error } = registrationValidation(req.body);
  console.log(req.body);
  const emailExists = await User.findOne({ email: req.body.email });
  if (emailExists) return res.status(400).send('email already exists!!');
  if (error) return res.status(400).send(error.details[0].message);
  const salt = bcrypt.genSaltSync(10);
  const encryptedPass = bcrypt.hashSync(req.body.password, salt);
  const user = new User({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    password: encryptedPass,
  });
  try {
    const savedUser = await user.save();
    res.send(savedUser);
  } catch (err) {
    res.status(400).send(err);
  }
}



userController.signin= async(req,res)=>{
    let isAdmin;
  const { error } = loginValidation(req.body);
  console.log(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  const user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).send('email not found');
  const validPass = await bcrypt.compare(req.body.password, user.password);
  if (!validPass) return res.status(400).send('incorrect password!!');
  if (user.firstName === 'admin') {
    isAdmin = true;
  } else {
    isAdmin = false;
  }
  console.log(req.headers);
  console.log(req.connection.remoteAddress);
  const userActivity = new UserActivity({
    userId: user._id,
    ipAddress: req.ip,
    uaString: req.headers['user-agent'],

  });
  try {
    const savedActivity = await userActivity.save();
    res.send(savedActivity);
  } catch (err) {
    res.status(400).send(err);
  }
  const token = jwt.sign({ _id: user._id, isAdmin }, process.env.TOKEN_SECRET);
  res.header('authentication-token', token).send('logged in!!');
}


userController.showAlluser=async(req,res)=>{
    let users;
  const token = req.headers.authorization;
  if (!token) return res.status(401).send('Access denied');
  try {
    const decodedToken = jwt.verify(req.headers.authorization, process.env.TOKEN_SECRET);
    if (decodedToken.isAdmin) {
      users = await User.find();
    } else {
      users = await User.find({ _id: decodedToken._id });
    }

    res.status(200).send(users);
    console.log(decodedToken);
  } catch (err) {
    return res.send('invalid Token');
  }
}

userController.showParticularuser=async(req,res)=>{
  const user = await User.find({ _id: req.params.id });
  res.status(200).send(user);
}

userController.update=async(req,res)=>{
  const a = await User.findOneAndUpdate({ _id: req.params.id }, { $set: { firstName: req.body.firstName } }, { new: true }, (err, updatedObeject) => {
    if (err) {
      console.log('error occured!!!!');
    } else {
      console.log(updatedObeject);
      res.status(200).send(updatedObeject);
    }
  });
}


module.exports = {
    signup: userController.signup,
    signin: userController.signin,
    showAlluser: userController.showAlluser,
    showParticularuser: userController.show,
    update: userController.update,
    inactiveUsers: userController.inactiveUsers
}



