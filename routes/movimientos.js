const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const { Movimiento } = require('../models');

// Obtener movimientos del usuario
router.get('/', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.userId;

    const movimientos = await Movimiento.findAll({
      where: { user_id: userId },
      order: [['fecha', 'DESC']]
    });

    res.json(movimientos);
  } catch (err) {
    console.error('Error al obtener movimientos:', err);
    res.status(500).json({ message: 'Error al obtener movimientos' });
  }
});

// Agregar movimiento (ingreso o gasto)
router.post('/', authMiddleware, async (req, res) => {
  const { tipo, cantidad, descripcion } = req.body;
  const userId = req.user.userId;

  try {
    const movimiento = await Movimiento.create({
      user_id: userId,
      tipo,
      cantidad,
      descripcion
    });

    res.status(201).json({ message: 'Movimiento agregado correctamente', movimiento });
  } catch (err) {
    console.error('Error al agregar movimiento:', err);
    res.status(500).json({ message: 'Error al agregar movimiento' });
  }
});

// Actualizar un movimiento por ID
router.put('/:id', authMiddleware, async (req, res) => {
  const userId = req.user.userId;
  const { id } = req.params;
  const { tipo, cantidad, descripcion, fecha } = req.body;

  try {
    const movimiento = await Movimiento.findOne({
      where: {
        id,
        user_id: userId
      }
    });

    if (!movimiento) {
      return res.status(404).json({ message: 'Movimiento no encontrado' });
    }

    await movimiento.update({ tipo, cantidad, descripcion, fecha });

    res.json({ message: 'Movimiento actualizado correctamente', movimiento });
  } catch (error) {
    console.error('Error al actualizar movimiento:', error);
    res.status(500).json({ message: 'Error al actualizar movimiento' });
  }
});


// Eliminar un movimiento por ID
router.delete('/:id', authMiddleware, async (req, res) => {
  const userId = req.user.userId;
  const { id } = req.params;

  try {
    const deleted = await Movimiento.destroy({
      where: {
        id,
        user_id: userId
      }
    });

    if (deleted === 0) {
      return res.status(404).json({ message: 'Movimiento no encontrado' });
    }

    res.json({ message: 'Movimiento eliminado correctamente' });
  } catch (error) {
    console.error('Error al eliminar movimiento:', error);
    res.status(500).json({ message: 'Error al eliminar movimiento' });
  }
});

module.exports = router;
