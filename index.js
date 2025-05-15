const express = require('express');
const cors = require('cors');
require('dotenv').config();
require('./cron');
const router = express.Router();


const authRoutes = require('./routes/auth');
const movimientoRoutes = require('./routes/movimientos');
const deudasRoutes = require('./routes/deudas');
const { sequelize } = require('./models');
const ahorroRoutes = require('./routes/ahorrosCompartidos');

// const sequelize = require('./config/db');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/movimientos', movimientoRoutes);
app.use('/api/deudas', deudasRoutes);
app.use('/api/ahorrosCompartidos', ahorroRoutes);

// Middleware para manejar errores
const PORT = process.env.PORT || 3000;

sequelize.authenticate()
  .then(() => {
    console.log('🟢 Conexión a MySQL exitosa');

    app.listen(PORT, () => {
      console.log(`Servidor corriendo en puerto ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('🔴 Error al conectar a MySQL:', err);
  });

module.exports = router;