const { body, validationResult } = require('express-validator');

const validateEmail = () => body('email').isEmail().withMessage('Invalid email address');
const validatePassword = () => body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters');
const validateBlueprintTitle = () => body('title').isLength({ min: 5, max: 120 }).withMessage('Title must be between 5 and 120 characters');

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

module.exports = {
  validateEmail,
  validatePassword,
  validateBlueprintTitle,
  handleValidationErrors
};
