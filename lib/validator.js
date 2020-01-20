import joi from 'joi';

exports.registrationValidation = (data) => {
  const schema = {
    firstName: joi.string().required(),
    lastName: joi.string().required(),
    email: joi.string().required().email(),
    password: joi.string().required().min(6).max(20),
  };
  return joi.validate(data, schema);
};

exports.loginValidation = (data) => {
  const schema = {

    email: joi.string().required().email(),
    password: joi.string().required().min(6).max(20),

  };
  return joi.validate(data, schema);
};
