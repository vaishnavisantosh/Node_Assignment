import joi from 'joi'

const registrationValidation = (data) => {
  const schema = {
    firstName: joi.string()
      .required(),
    lastName: joi.string()
      .required(),
    email: joi.string()
      .required()
      .email(),
    password: joi.string()
      .required()
      .min(6)
      .max(20)

  }
  return joi.validate(data, schema)
}

const loginValidation = (data) => {
  const schema = {
    firstName: joi.string()
      .required(),
    lastName: joi.string()
      .required(),
    email: joi.string()
      .required()
      .email(),
    password: joi.string()
      .required()
      .min(6)
      .max(20)

  }
  return joi.validate(data, schema)
}

module.exports.registrationValidation = registrationValidation
module.exports.loginValidation = loginValidation
