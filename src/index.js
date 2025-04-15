require('dotenv').config();

const app = require('./app');
const sequelize = require('./config/db');


// Start the server after DB is connected
const PORT = process.env.PORT || 3000;

sequelize.authenticate()
  .then(() => {
    console.log('🟢 Database connected');

    // Sync models
    return sequelize.sync({ alter: true });
  })
  .then(() => {
    app.listen(PORT, () => {
      console.log(`🚀 Server running at http://localhost:${PORT}`);
    });
  })
  .catch(err => {
    console.error('🔴 Unable to connect to the database:', err);
  });

  