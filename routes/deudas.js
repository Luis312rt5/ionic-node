const express = require('express');
const router = express.Router();
const pool = require('../db');
const verifyToken = require('../middleware/authMiddleware');
const { enviarCorreoDeuda } = require('../utils/mailer');

// GET - Obtener deudas
router.get('/', verifyToken, async (req, res) => {
  const userId = req.user.userId; // ✅ Accedemos de manera consistente
  try {
    const [deudas] = await pool.query(
      'SELECT * FROM deudas WHERE user_id = ? ORDER BY fecha DESC',
      [userId]
    );
    res.json(deudas);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener las deudas' });
  }
});

// POST - Registrar deuda
router.post('/', verifyToken, async (req, res) => {
  const userId = req.user.userId;
  const { descripcion, monto } = req.body;

  console.log('Datos recibidos:', { userId, descripcion, monto });

  try {
    const [userRows] = await pool.query('SELECT email FROM users WHERE id = ?', [userId]);
    if (userRows.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    const correoUsuario = userRows[0].email;

    const [result] = await pool.query(
      'INSERT INTO deudas (user_id, descripcion, monto, fecha) VALUES (?, ?, ?, NOW())',
      [userId, descripcion, monto]
    );

    // Enviar correo de confirmación
    await enviarCorreoDeuda(correoUsuario, {
      descripcion,
      monto
    });

    res.json({ id: result.insertId, descripcion, monto });
  } catch (error) {
    console.error('ERROR EN BACKEND:', error);
    res.status(500).json({ error: 'Error al registrar la deuda' });
  }
});


// DELETE - Eliminar deuda
router.delete('/:id', verifyToken, async (req, res) => {
  const userId = req.user.userId; // ✅ Accedemos de manera consistente
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM deudas WHERE id = ? AND user_id = ?', [id, userId]);
    res.json({ message: 'Deuda eliminada' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar la deuda' });
  }
});

module.exports = router;
