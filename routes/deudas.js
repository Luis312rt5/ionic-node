const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/authMiddleware');
const { Deuda, User } = require('../models');
const { enviarCorreoDeuda } = require('../utils/mailer');

// GET - Obtener deudas del usuario
router.get('/', verifyToken, async (req, res) => {
  const userId = req.user.userId;

  try {
    const deudas = await Deuda.findAll({
      where: { user_id: userId },
      order: [['fecha', 'DESC']]
    });

    res.json(deudas);
  } catch (error) {
    console.error('Error al obtener deudas:', error);
    res.status(500).json({ error: 'Error al obtener las deudas' });
  }
});

// POST - Registrar una nueva deuda
router.post('/', verifyToken, async (req, res) => {
  const userId = req.user.userId;
  const { descripcion, monto } = req.body;

  try {
    // Buscar el correo del usuario
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    // Crear la deuda
    const nuevaDeuda = await Deuda.create({
      user_id: userId,
      descripcion,
      monto
    });

    // Enviar correo de confirmación
    await enviarCorreoDeuda(user.email, {
      descripcion,
      monto
    });

    res.json(nuevaDeuda);
  } catch (error) {
    console.error('Error al registrar la deuda:', error);
    res.status(500).json({ error: 'Error al registrar la deuda' });
  }
});

// DELETE - Eliminar deuda por ID
router.delete('/:id', verifyToken, async (req, res) => {
  const userId = req.user.userId;
  const { id } = req.params;

  try {
    const eliminada = await Deuda.destroy({
      where: {
        id,
        user_id: userId
      }
    });

    if (eliminada === 0) {
      return res.status(404).json({ error: 'Deuda no encontrada' });
    }

    res.json({ message: 'Deuda eliminada' });
  } catch (error) {
    console.error('Error al eliminar deuda:', error);
    res.status(500).json({ error: 'Error al eliminar la deuda' });
  }
});

module.exports = router;
