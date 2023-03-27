module.exports = {
    port: process.env.PORT || 3000,
    db: {
      url: process.env.DB_URL || 'mongodb://127.0.0.1:27017/bettingwebsite',
    },
    jwtSecret: process.env.JWT_SECRET || 'secret',
  };