const ApiError = require('../utils/apiError');
const { verifyToken } = require('../utils/jwt');
const prisma = require('../config/db');

/**
 * Strict authentication — rejects the request with 401 if no valid token.
 */
const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new ApiError(401, 'Authentication token missing or invalid');
    }

    const token = authHeader.split(' ')[1];
    const decoded = verifyToken(token);

    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: { id: true, name: true, email: true, role: true },
    });

    if (!user) {
      throw new ApiError(401, 'User no longer exists');
    }

    req.user = user;
    next();
  } catch (error) {
    next(new ApiError(401, error.message || 'Unauthorized'));
  }
};

/**
 * Optional authentication — populates req.user when a valid token is present,
 * but allows unauthenticated requests to proceed (req.user stays undefined).
 * Use on public routes that need to know who is calling for access-level decisions.
 */
const optionalAuthenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      // No token — continue as unauthenticated
      return next();
    }

    const token = authHeader.split(' ')[1];
    let decoded;
    try {
      decoded = verifyToken(token);
    } catch {
      // Invalid token — treat as unauthenticated (don't reject)
      return next();
    }

    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: { id: true, name: true, email: true, role: true },
    });

    if (user) {
      req.user = user;
    }
    next();
  } catch {
    // Any unexpected error — continue as unauthenticated
    next();
  }
};

module.exports = authenticate;
module.exports.optionalAuthenticate = optionalAuthenticate;
