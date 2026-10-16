const ApiResponse = require('../utils/apiResponse');

const register = async (req, res, next) => {
  try {
    // TODO: Register user with hashed password
    ApiResponse.success(res, { user: {} }, 'User registered successfully', 201);
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    // TODO: Validate credentials & return JWT
    ApiResponse.success(res, { token: '', user: {} }, 'Login successful');
  } catch (error) {
    next(error);
  }
};

const getProfile = async (req, res, next) => {
  try {
    ApiResponse.success(res, { user: req.user }, 'Profile fetched successfully');
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  getProfile,
};
