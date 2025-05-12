const express = require('express');
const db = require('../db');
const authMiddleware = require('../middleware/authMiddleware');
const pool = require('../db');

const router = express.Router();

// Obtener movimientos del usuario
router.get('/', authMiddleware, async (req, res) => {
  try {
    // Usamos req.user.userId tal como estaba
    const userId = req.user.userId;
    const [movimientos] = await db.query('SELECT * FROM movimientos WHERE user_id = ? ORDER BY fecha DESC', [userId]);
    res.json(movimientos);
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener movimientos', error: err.message });
  }
});

// Agregar movimiento (ingreso o gasto)
router.post('/', authMiddleware, async (req, res) => {
  const { tipo, cantidad, descripcion } = req.body;
  // Usamos req.user.userId tal como estaba
  const userId = req.user.userId;

  try {
    await db.query(
      'INSERT INTO movimientos (user_id, tipo, cantidad, descripcion) VALUES (?, ?, ?, ?)',
      [userId, tipo, cantidad, descripcion]
    );
    res.status(201).json({ message: 'Movimiento agregado correctamente' });
  } catch (err) {
    res.status(500).json({ message: 'Error al agregar movimiento', error: err.message });
  }
});

// Eliminar un movimiento por ID
router.delete('/:id', authMiddleware, async (req, res) => {
  const { id } = req.params;

  try {
    const [resultado] = await pool.query('DELETE FROM movimientos WHERE id = ?', [id]);
    if (resultado.affectedRows === 0) {
      return res.status(404).json({ message: 'Movimiento no encontrado' });
    }

    res.json({ message: 'Movimiento eliminado correctamente' });
  } catch (error) {
    console.error('Error al eliminar movimiento:', error);
    res.status(500).json({ message: 'Error del servidor' });
  }
});

module.exports = router;
