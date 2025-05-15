const express = require('express');
const cors = require('cors');
require('dotenv').config();
require('./cron');

const authRoutes = require('./routes/auth');
const movimientoRoutes = require('./routes/movimientos');
const deudasRoutes = require('./routes/deudas');
const { sequelize } = require('./models');

// const sequelize = require('./config/db');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/movimientos', movimientoRoutes);
app.use('/api/deudas', deudasRoutes);

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

