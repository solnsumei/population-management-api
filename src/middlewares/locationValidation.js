import Joi from '@hapi/joi';
import koa2Validate from 'koa2-validation';
import Location from '../models/Location';

export const validateLocationId = () => koa2Validate({
  params: {
    id: Joi.string().hex().length(24).required(),
  },
});

const populationSchema = {
  male: Joi.number().integer().min(0).required(),
  female: Joi.number().integer().min(0).required(),
};

const createLocationSchema = {
  body: {
    name: Joi.string().min(2).max(30).required(),
    parentId: Joi.string().hex().length(24),
    population: Joi.object(populationSchema).required(),
  }, opt: { abortEarly: false },
};

export const validateParentId = async (ctx, next) => {
  const { parentId } = ctx.request.body;
  if (parentId) {
    try {
      const doc = await Location.findOne({ _id: parentId, parent: null }).exec();
      if (!doc) {
        ctx.throw(400, 'Parent id is invalid');
      }
      return next();

    } catch (error) {
      throw error;
    }
  }
  return next();
};

const updateLocationSchema = {
  body: {
    population: Joi.object(populationSchema).required(),
  }, opt: { abortEarly: false },
};

export const validateCreateLocationRequest = () => koa2Validate(createLocationSchema);
export const validateUpdateLocationBody = () => koa2Validate(updateLocationSchema);
