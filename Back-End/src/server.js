 require('dotenv').config();
const app = require('./app');
const { connectDB } = require('./config/db');

const PORT = process.env.PORT || 3000;

async function start() {
  try {
    await connectDB(process.env.MONGODB_URI);
    app.listen(PORT, () => {
      console.log(`API a correr em http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('Erro a ligar à BD:', err.message);
    process.exit(1);
  }
}

start();

