// server/src/utils/validator.js
import { validationResult } from "express-validator";

/**
 * Middleware to validate request body using express-validator
 */
export const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: errors.array(),
    });
  }
  next();
};

/**
 * Quick schema validator (manual)
 */
export const validateSchema = (data, schema) => {
  const errors = [];
  for (const key in schema) {
    if (schema[key].required && !data[key]) {
      errors.push(`${key} is required`);
    }
  }
  return errors;
};
