const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const { AhorroCompartido, ParticipanteAhorro, User } = require('../models');

// ✅ Aportar a un ahorro compartido
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

    if (!participante) {
      participante = await ParticipanteAhorro.create({
        ahorro_id: ahorroId,
        usuario_id: usuarioId,
        aporte_total: 0
      });
    }

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

// ✅ Crear un nuevo ahorro compartido
router.post('/', authMiddleware, async (req, res) => {
  const usuarioId = req.user.userId;
  const { nombre, montoObjetivo } = req.body;

  try {
    const ahorro = await AhorroCompartido.create({
      nombre,
      monto_objetivo: montoObjetivo,
      monto_actual: 0,
      creador_id: usuarioId
    });

    await ParticipanteAhorro.create({
      ahorro_id: ahorro.id,
      usuario_id: usuarioId,
      aporte_total: 0
    });

    res.status(201).json(ahorro);
  } catch (error) {
    console.error('Error al crear ahorro:', error);
    res.status(500).json({ error: 'Error al crear el ahorro' });
  }
});

// ✅ Ver todos los ahorros
router.get('/', authMiddleware, async (req, res) => {
  try {
    const ahorros = await AhorroCompartido.findAll();
    res.json(ahorros);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener ahorros' });
  }
});

// ✅ Ver ahorros en los que el usuario participa
router.get('/mis', authMiddleware, async (req, res) => {
  const usuarioId = req.user.userId;
  try {
    const participaciones = await ParticipanteAhorro.findAll({
      where: { usuario_id: usuarioId },
      include: [AhorroCompartido]
    });

    const misAhorros = participaciones.map(p => p.ahorro_compartido);
    res.json(misAhorros);
  } catch (error) {
    console.error('Error al obtener ahorros del usuario:', error);
    res.status(500).json({ error: 'Error al obtener mis ahorros' });
  }
});

// ✅ Agregar otro usuario al ahorro por correo
router.post('/:id/agregarUsuario', authMiddleware, async (req, res) => {
  const ahorroId = req.params.id;
  const { email } = req.body;  // ← CAMBIADO
  const solicitanteId = req.user.userId;

  try {
    const ahorro = await AhorroCompartido.findByPk(ahorroId);
    if (!ahorro) {
      return res.status(404).json({ error: 'Ahorro no encontrado' });
    }

    if (ahorro.creador_id !== solicitanteId) {
      return res.status(403).json({ error: 'No tienes permisos para agregar usuarios a este ahorro' });
    }

    const usuario = await User.findOne({ where: { email } }); // ← CAMBIADO
    if (!usuario) {
      return res.status(404).json({ error: 'Usuario no encontrado con ese correo' });
    }

    const yaExiste = await ParticipanteAhorro.findOne({
      where: {
        ahorro_id: ahorroId,
        usuario_id: usuario.id
      }
    });

    if (yaExiste) {
      return res.status(400).json({ error: 'El usuario ya participa en este ahorro' });
    }

    await ParticipanteAhorro.create({
      ahorro_id: ahorroId,
      usuario_id: usuario.id,
      aporte_total: 0
    });

    res.json({ message: 'Usuario agregado correctamente al ahorro' });
  } catch (error) {
  console.error('Error al agregar usuario por correo:', error);
  res.status(500).json({ error: 'Error al agregar el usuario al ahorro', details: error.message });
}
});

module.exports = router;