const express = require('express');
const router = express.Router();
const Cliente = require('../models/Cliente');
const authJWT = require('../middlewares/authJWT'); // Middleware para autenticación JWT

// Crear nuevo cliente
router.post('/', authJWT, async (req, res) => {
  try {
    const { nombre, email, telefono, direccion } = req.body;

    // Verificar si el email ya existe
    const clienteExistente = await Cliente.findOne({ where: { email } });
    if (clienteExistente) {
      return res.status(400).json({ error: 'Este correo ya está registrado como cliente' });
    }

    // Crear cliente
    const cliente = await Cliente.create({ nombre, email, telefono, direccion });
    res.status(201).json({ cliente, mensaje: 'Cliente registrado exitosamente' });

  } catch (error) {
    console.error('Error al crear cliente:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Obtener todos los clientes (opcional)
router.get('/', authJWT, async (req, res) => {
  try {
    const clientes = await Cliente.findAll();
    res.json(clientes);
  } catch (error) {
    console.error('Error al obtener clientes:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Obtener cliente por ID (opcional)
router.get('/:id', authJWT, async (req, res) => {
  try {
    const cliente = await Cliente.findByPk(req.params.id);
    if (!cliente) {
      return res.status(404).json({ error: 'Cliente no encontrado' });
    }
    res.json(cliente);
  } catch (error) {
    console.error('Error al obtener cliente:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});
// Actualizar cliente
router.put('/:id', authJWT, async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, email, telefono, estado } = req.body;

    const cliente = await Cliente.findByPk(id);
    if (!cliente) {
      return res.status(404).json({ error: 'Cliente no encontrado' });
    }

    // Validación simple
    if (!nombre || !email) {
      return res.status(400).json({ error: 'Nombre y email son requeridos' });
    }

    await cliente.update({ nombre, email, telefono, estado });
    res.json(cliente);
  } catch (error) {
    console.error('Error al actualizar cliente:', error);
    res.status(500).json({ error: 'Error al actualizar cliente' });
  }
});


module.exports = router;
