
/* eslint-disable no-underscore-dangle */
import dotenv from 'dotenv';
import express from 'express';
import User from '../model/User.model';
import controllers from '../controller/users.controller';

const router = express.Router();
dotenv.config({ path: './.env' });

router.post('/register', controllers.signUp);
router.post('/login', controllers.signin);
router.get('/dashboard', controllers.showAlluser);
router.get('/dashboard/:id', controllers.showParticularuser);
router.put('/users/:id', controllers.update);


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
