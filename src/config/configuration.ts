export const configuration = () => ({
  port: parseInt(process.env.PORT, 10) || 8000,
  database: {
    uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/apnacollegedemo',
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'your-jwt-secret-change-this',
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  },
  session: {
    secret: process.env.SESSION_SECRET || 'your-session-secret-change-this',
  },
  frontend: {
    url: process.env.FRONTEND_URL || 'http://localhost:3000',
  },
});