export const jwtConfig = {
  access: {
    secret: process.env.JWT_ACCESS_SECRET,
    expiresIn: process.env.JWT_ACCESS_EXPIRES_IN || '1h',
  },
  refresh: {
    secret: process.env.JWT_REFRESH_SECRET,
    expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  },
};

export const validateJwtConfig = () => {
  if (!jwtConfig.access.secret || !jwtConfig.refresh.secret) {
    throw new Error('JWT secrets are not configured properly');
  }
};