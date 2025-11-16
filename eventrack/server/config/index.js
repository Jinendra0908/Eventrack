// Server configuration
export const config = {
  jwt: {
    secret: process.env.JWT_SECRET || 'your-secret-key-here',
    expiresIn: '7d'
  },
  database: {
    uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/eventrack'
  },
  server: {
    port: process.env.PORT || 3000,
    env: process.env.NODE_ENV || 'development'
  },
  pagination: {
    defaultLimit: 50,
    maxLimit: 100
  }
}

export default config
