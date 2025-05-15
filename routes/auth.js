const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
//const db = require('../db');
const { User } = require('../models');
require('dotenv').config();

const router = express.Router();

// Registro de usuario
router.post('/register', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Verificar si ya existe el usuario
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'El usuario ya existe' });
    }

    // Hashear la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear el usuario
    const newUser = await User.create({
      email,
      password: hashedPassword
    });

    res.status(201).json({
      message: 'Usuario registrado exitosamente',
      user: {
        id: newUser.id,
        email: newUser.email
      }
    });
  } catch (err) {
    console.error('Error al registrar usuario:', err);
    res.status(500).json({ message: 'Error del servidor' });
  }
});

// Login de usuario
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Buscar el usuario
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(401).json({ message: 'Credenciales inválidas' });

    // Verificar la contraseña
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Credenciales inválidas' });

    // Generar token
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '2h' });

    res.json({ token });
  } catch (err) {
    console.error('Error al iniciar sesión:', err);
    res.status(500).json({ message: 'Error del servidor' });
  }
});

module.exports = router;
