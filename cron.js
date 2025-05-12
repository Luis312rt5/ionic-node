const cron = require('node-cron');
const pool = require('./db');
const { enviarCorreoDeuda } = require('./utils/mailer');

// Ejecutar todos los días a las 9:00 AM
cron.schedule('0 9 * * *', async () => {
  console.log('⏰ Enviando recordatorios diarios de deudas...');

  try {
    // Obtener deudas con el correo de cada usuario
    const [registros] = await pool.query(`
      SELECT u.email, d.descripcion, d.monto, d.fecha
      FROM users u
      JOIN deudas d ON u.id = d.user_id
      ORDER BY u.email, d.fecha DESC
    `);

    // Agrupar por correo
    const deudasPorUsuario = {};

    registros.forEach((row) => {
      if (!deudasPorUsuario[row.email]) {
        deudasPorUsuario[row.email] = [];
      }

      deudasPorUsuario[row.email].push({
        descripcion: row.descripcion,
        monto: Number(row.monto), // Asegura que sea número
        fecha: row.fecha
      });
    });

    // Enviar correo a cada usuario
    for (const [email, deudas] of Object.entries(deudasPorUsuario)) {
      const cuerpoExtra = deudas.map(d => `
        <hr>
        <p><strong>Descripción:</strong> ${d.descripcion}</p>
        <p><strong>Monto:</strong> $${d.monto.toFixed(2)}</p>
        <p><strong>Fecha:</strong> ${new Date(d.fecha).toLocaleDateString()}</p>
      `).join('');

      await enviarCorreoDeuda(email, {
        descripcion: 'Recordatorio diario de tus deudas pendientes',
        monto: null, // Ya no se usa directamente
        cuerpoExtra
      });
    }

    console.log('✅ Recordatorios enviados.');
  } catch (err) {
    console.error('❌ Error al enviar recordatorios:', err);
  }
});
