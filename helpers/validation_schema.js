const Joi = require('@hapi/joi')

const authSchema = Joi.object({
  name: Joi.string(),
  email: Joi.string().email().lowercase().required(),
  password: Joi.string().min(2).required(),
})

const placeSchema = Joi.object({
  lat: Joi.required(),
  lng: Joi.required(),
})

const coordinateSchema = Joi.object({
  lat: Joi.required(),
  lng: Joi.required(),
  place_id: Joi.required(),
})

module.exports = {
  authSchema,
  placeSchema,
  coordinateSchema
}