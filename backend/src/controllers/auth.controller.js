const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const prisma = require('../config/db');
const ApiResponse = require('../utils/apiResponse');
const ApiError = require('../utils/apiError');
const { generateToken } = require('../utils/jwt');

// POST /api/v1/auth/register

const register = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;
    

    // Basic validation
    if (!name || !email || !password) {
      throw new ApiError(400, 'Name, email, and password are required');
    }

    // Only allow USER or ORGANIZER during registration.
    // Never allow users to register themselves as ADMIN.
    const userRole = role === 'ORGANIZER' ? 'ORGANIZER' : 'USER';

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new ApiError(409, 'An account with this email already exists');
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Create user
    const user = await prisma.user.create({
      data: {
        id: crypto.randomUUID(),
        name,
        email,
        passwordHash,
        role: userRole,
        updatedAt: new Date(),
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });
    // Generate JWT
    const token = generateToken({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    ApiResponse.success(
      res,
      { token, user },
      'Account created successfully',
      201
    );

  } catch (error) {
    next(error);
  }
};

// POST /api/v1/auth/login
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Basic validation
    if (!email || !password) {
      throw new ApiError(400, 'Email and password are required');
    }

    // Find user by email
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      // Use a generic message so we don't reveal whether the email exists
      throw new ApiError(401, 'Invalid email or password');
    }

    // Compare the provided password with the stored hash
    const isPasswordCorrect = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordCorrect) {
      throw new ApiError(401, 'Invalid email or password');
    }

    // Generate JWT token
    const token = generateToken({ id: user.id, email: user.email, role: user.role });

    // Send back the token and safe user info (no password hash)
    const safeUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone,
      avatar: user.avatar,
    };

    ApiResponse.success(res, { token, user: safeUser }, 'Login successful');
  } catch (error) {
    next(error);
  }
};

// GET /api/v1/auth/profile  (requires auth middleware)
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
