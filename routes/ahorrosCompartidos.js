const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const { AhorroCompartido, ParticipanteAhorro, User } = require('../models');

// Aportar a un ahorro compartido
router.post('/:id/aportar', authMiddleware, async (req, res) => {
  const usuarioId = req.user.userId;
  const ahorroId = req.params.id;
  const { cantidad } = req.body;

  if (!cantidad || cantidad <= 0) {
    return res.status(400).json({ error: 'Cantidad inválida' });
  }

  try {
    const ahorro = await AhorroCompartido.findByPk(ahorroId);
    if (!ahorro) {
      return res.status(404).json({ error: 'Ahorro no encontrado' });
    }

    let participante = await ParticipanteAhorro.findOne({
      where: {
        ahorro_id: ahorroId,
        usuario_id: usuarioId
      }
    });

    // Si no existe, se registra como participante
    if (!participante) {
      participante = await ParticipanteAhorro.create({
        ahorro_id: ahorroId,
        usuario_id: usuarioId,
        aporte_total: 0
      });
    }

    // Actualiza el aporte del usuario y el monto total del fondo
    participante.aporte_total += parseFloat(cantidad);
    await participante.save();

    ahorro.monto_actual += parseFloat(cantidad);
    await ahorro.save();

    res.json({
      message: 'Aporte realizado correctamente',
      nuevoMonto: ahorro.monto_actual,
      miAporte: participante.aporte_total
    });
  } catch (error) {
    console.error('Error al aportar al ahorro:', error);
    res.status(500).json({ error: 'Error al realizar el aporte' });
  }
});
