const app = require('./app');
const connectDB = require('./config/db');
const env = require('./config/env');

const PORT = env.PORT;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
});