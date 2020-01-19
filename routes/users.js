/* eslint-disable import/named */
/* eslint-disable no-underscore-dangle */
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import express from 'express';
import User from '../model/User.model';
import UserActivity from '../model/UserActivity.model';
import controller from '../controller/users.controller';
// const express = require('express');

const router = express.Router();
dotenv.config({ path: './.env' });

router.post('/register', controller.signup);
router.post('/login', controller.signin );
router.get('/dashboard',controller.showAlluser );
router.get('/dashboard/:id', controller.showParticularuser);
router.put('/users/:id',controller.update);



router.get('/useractivity', async (req, res) => {
  // const date = new Date();
  // const dt = date.setDate(date.getDate() - process.env.INACTIVEDAYS);
  // console.log(dt);
  // const response = await UserActivity.find({ loginDate: { $lt: dt } }).populate('users').exec();
  // // console.log(response);
  // return res.status(200).send(response);
  // const aggre = await User.aggregate.lookup({
  //   from: 'UserActivity', // or Races.collection.name
  //   localField: '_id',
  //   foreignField: '_id',
  //   as: 'agg',
  // });
  // res.send(aggre);
  // console.log(`arrgreee ${agg}`);


  const aggregate = await User.aggregate([{
    $lookup: {
      from: 'useractivity', localField: '_id', foreignField: 'userId', as: 'fromItems',
    },
  }]).exec();
  console.log(aggregate);
});

module.exports = router;
