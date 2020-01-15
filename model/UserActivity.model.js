import mongoose from 'mongoose'

const userActivitySchema = new mongoose.Schema({
  IP: {
    type: Number

  },
  UAstring: {
    type: String

  },

  Date: {
    type: Date,
    default: Date.now
  }

})

module.exports = mongoose.model('UsersActivity', userActivitySchema)
