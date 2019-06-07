import Joi from '@hapi/joi';
import koa2Validate from 'koa2-validation';

const registrationSchema = {
  body: {
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
  }, opt: { abortEarly: false },
};

const loginSchema = {
  body: {
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }, opt: { abortEarly: false },
};

export const validateRegistrationRequest = () => koa2Validate(registrationSchema);
export const validateLoginRequest = () => koa2Validate(loginSchema);
