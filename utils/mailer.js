const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

const enviarCorreoDeuda = async (correoDestino, deuda) => {
  const mailOptions = {
    from: `"App Finanzas" <${process.env.EMAIL_USER}>`,
    to: correoDestino,
    subject: 'Confirmación de nueva deuda registrada',
    html: `
      <h2>${deuda.descripcion}</h2>
      ${deuda.monto !== null && deuda.monto !== undefined ? `<p><strong>Monto:</strong> $${deuda.monto.toFixed(2)}</p>` : ''}
      <p><strong>Fecha:</strong> ${new Date().toLocaleDateString()}</p>
      ${deuda.cuerpoExtra || ''}
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Correo de deuda enviado a', correoDestino);
  } catch (error) {
    console.error('Error al enviar el correo:', error);
  }
};

module.exports = { enviarCorreoDeuda };
