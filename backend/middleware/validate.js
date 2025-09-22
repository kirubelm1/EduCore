
const validate = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: 'Validation error', details: error.details });
    }
    next();
  };
};

//npm install joi
const Joi = require('joi');

const userSchema = Joi.object({
  username: Joi.string().required().min(3).max(30),
  password: Joi.string().required().min(6),
  role: Joi.string().valid('Admin', 'Student', 'Teacher', 'Parent').required(),
});

module.exports = { validate, userSchema };
