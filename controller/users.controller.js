/* eslint-disable max-len */
/* eslint-disable no-underscore-dangle */
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import User from '../model/User.model';
import UserActivity from '../model/UserActivity.model';
import validator from '../lib/validator';

dotenv.config({ path: './.env' });

exports.signUp = async (req, res) => {
  const { error } = validator.registrationValidation(req.body);
  await User.findOne({ email: req.body.email });
  try {
    res.send('email already exists!!');
  } catch (err) {
    res.status(400).send(error.details[0].message);
  }

  const salt = bcrypt.genSaltSync(10);
  const encryptedPass = bcrypt.hashSync(req.body.password, salt);
  const user = new User({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    password: encryptedPass,
  });

  await user.save();
  try {
    res.status(200).send('login Successful');
  } catch (err) {
    res.status(400).send(err);
  }
};

exports.signin = async (req, res) => {
  let isAdmin;
  const { error } = validator.loginValidation(req.body);
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
  const userActivity = new UserActivity({
    userId: user._id,
    ipAddress: req.ip,
    uaString: req.headers['user-agent'],

  });
  await userActivity.save();
  try {
    res.send('logged in!');
  } catch (err) {
    res.status(400).send(err);
  }
  const token = jwt.sign({ _id: user._id, isAdmin }, process.env.TOKEN_SECRET);
  res.header('authentication-token', token).send('logged in!!');
};


exports.showAlluser = async (req, res) => {
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
  } catch (err) {
    return res.send('invalid Token');
  }
};

exports.showParticularuser = async (req, res) => {
  const token = req.headers.authorization;
  if (!token) return res.status(401).send('Access denied');
  const decodedToken = jwt.verify(req.headers.authorization, process.env.TOKEN_SECRET);
  const user = await User.find({ _id: decodedToken._id });
  try {
    res.status(200).send(user);
  } catch (error) {
    res.status(400).send('something went wrong');
  }
};
exports.update = async (req, res) => {
  const token = req.headers.authorization;
  if (!token) return res.status(401).send('Access denied');
  const decodedToken = jwt.verify(req.headers.authorization, process.env.TOKEN_SECRET);
  await User.findOneAndUpdate({ _id: decodedToken._id }, { $set: { firstName: req.body.firstName } }, { new: true }, (err, updatedObeject) => {
    try {
      res.status(200).send('updated successfully!');
    } catch (error) {
      res.status(400).send('unable to update');
    }
  });
};

exports.userActivity = async (req, res) => {
  const activeUser = await User.aggregate([{
    $lookup: {
      from: 'useractivity', localField: '_id', foreignField: 'userId', as: 'fromItems',
    },
  }]).exec();
  try {
    res.send(activeUser);
  } catch (err) {
    res.send('somthing went wrong!');
  }
};
