import Joi from 'joi';
import mongoose from 'mongoose';

const objectId = Joi.string().custom((value, helpers) => {
  if (!mongoose.Types.ObjectId.isValid(value)) {
    return helpers.error('any.invalid');
  }
  return value;
})

export const createMovieValidation = Joi.object({
  title: Joi.string().required(),
  genre: Joi.string().required(),
  rating: Joi.number().required(),
  streamingLink: Joi.string().required(),
});

export const updateMovieValidation = Joi.object({
  id: objectId.required(),
  title: Joi.string(),
  genre: Joi.string(),
  rating: Joi.number(),
  streamingLink: Joi.string(),
});

export const deleteMovieValidation = Joi.object({
  id: objectId.required(),
});

export const getMovieByIdValidation = Joi.object({
  id: objectId.required(),
});

export const searchMoviesValidation = Joi.object({
  q: Joi.string().required(),
});