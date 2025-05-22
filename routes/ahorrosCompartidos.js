  const express = require('express');
  const router = express.Router();
  const authMiddleware = require('../middleware/authMiddleware');
  const { AhorroCompartido, ParticipanteAhorro, User, Aporte } = require('../models'); // ⬅️ Asegúrate de importar Aporte

    // Aportar a un ahorro compartido
    router.post('/:id/aportar', authMiddleware, async (req, res) => {
    const ahorroId = req.params.id;
    const { cantidad } = req.body;
    const usuarioId = req.user.userId;

    try {
      const ahorro = await AhorroCompartido.findByPk(ahorroId);
      if (!ahorro) {
        return res.status(404).json({ error: 'Ahorro no encontrado' });
      }

      const participante = await ParticipanteAhorro.findOne({
        where: { ahorro_id: ahorroId, usuario_id: usuarioId }
      });

      if (!participante) {
        return res.status(403).json({ error: 'No estás asociado a este ahorro' });
      }

      // Actualizar monto del ahorro
      ahorro.monto_actual = parseFloat(ahorro.monto_actual) + parseFloat(cantidad);
      await ahorro.save();

      // Registrar el aporte
      await Aporte.create({
        ahorro_id: ahorroId,
        usuario_id: usuarioId,
        cantidad
      });

      res.json({ mensaje: 'Aporte realizado correctamente' });
    } catch (error) {
      console.error('Error al realizar el aporte:', error);
      res.status(500).json({ error: 'Error al realizar el aporte' });
    }
  });


    // ✅ Crear un nuevo ahorro compartido
    router.post('/', authMiddleware, async (req, res) => {
      const usuarioId = req.user.userId;
      const { nombre, descripcion, meta } = req.body;
      try {
        const ahorro = await AhorroCompartido.create({
          nombre,
          descripcion,
          meta,
          monto_actual: 0,
          creador_id: usuarioId,
          fecha_creacion: new Date()
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

    // Eliminar un ahorro compartido
    router.delete('/:id', authMiddleware, async (req, res) => {
      const ahorroId = req.params.id;
      try {
        // Verifica si el usuario tiene permiso para eliminar el ahorro
        const ahorro = await AhorroCompartido.findByPk(ahorroId);
        if (!ahorro) {
          return res.status(404).json({ error: 'Ahorro no encontrado' });
        }

        // Opcional: Verificar si el usuario es el creador del ahorro
        if (ahorro.creador_id !== req.user.userId) {
          return res.status(403).json({ error: 'No tienes permiso para eliminar este ahorro' });
        }

        await ahorro.destroy();
        res.json({ mensaje: 'Ahorro eliminado correctamente' });
      } catch (error) {
        res.status(500).json({ error: 'Error al eliminar el ahorro' });
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

    // ✅ Ver ahorros en los que el usuario participa (CORREGIDO)
    router.get('/mis', authMiddleware, async (req, res) => {
      const usuarioId = req.user.userId;
      try {
        const participaciones = await ParticipanteAhorro.findAll({
          where: { usuario_id: usuarioId },
          include: [{
            model: AhorroCompartido,
            as: 'ahorro_compartido' // <-- este alias debe coincidir con el definido en el modelo
          }]
        });

        const misAhorros = participaciones.map(p => p.ahorro_compartido);
        res.json(misAhorros);
      } catch (error) {
        console.error('Error al obtener ahorros del usuario:', error);
        res.status(500).json({ error: 'Error al obtener mis ahorros', details: error.message });
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
    
    router.get('/:id/aportes', authMiddleware, async (req, res) => {
    const ahorroId = req.params.id;

    try {
      const aportes = await Aporte.findAll({
        where: { ahorro_id: ahorroId },
        include: [{ model: User, as: 'usuario', attributes: ['id', 'email'] }],
        order: [['fecha', 'DESC']]
      });

      res.json(aportes);
    } catch (error) {
      console.error('Error al obtener aportes:', error);
      res.status(500).json({ error: 'Error al obtener los aportes' });
    }
  });

  module.exports = router;