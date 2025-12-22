const express = require('express');
const router = express.Router();
const MensajeContacto = require('../models/MensajeContacto');
const authJWT = require('../middlewares/authJWT');  
const verificarRol = require('../middlewares/verificarRol'); // Middleware para verificar roles
const verificarToken  = require('../middlewares/authJWT'); // Middleware para verificar el token JWT


// Ruta protegida
// Obtener todos los mensajes de contacto
router.get('/mensajes', authJWT, async (req, res) => {
  try {
    const mensajes = await MensajeContacto.findAll({ order: [['createdAt', 'DESC']] });
    res.status(200).json(mensajes);
  } catch (error) {
    console.error('Error al obtener los mensajes:', error);
    res.status(500).json({ error: 'Error al obtener los mensajes' });
  }
});

router.post('/', async (req, res) => {
  try {
    const { nombre, email, mensaje } = req.body;
    await MensajeContacto.create({ nombre, email, mensaje });
    res.status(201).json({ mensaje: 'Mensaje guardado con Exito...!' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al guardar el mensaje' });
  }
});

// Nuevo endpoint para contar mensajes no leídos
router.get('/mensajes/no-leidos', authJWT, verificarRol(['Admin', 'Asesor']), async (req, res) => {
  try {
    const cantidadNoLeidos = await MensajeContacto.count({
      where: { estado: 'Nuevo' }
    });

    res.json({ mensajes_no_leidos: cantidadNoLeidos });
  } catch (error) {
    console.error('Error al contar mensajes no leídos:', error);
    res.status(500).json({ error: 'Error al contar los mensajes no leídos' });
  }
});

// PUT /api/contacto/mensajes/:id/estado CAMBIAR ESTADO DE NEW A LEIDO O RESPONDIDO
router.put('/mensajes/:id/estado', verificarToken, verificarRol(['Admin', 'Asesor']), async (req, res) => {
  const { id } = req.params;
  const { estado } = req.body;

  try {
    const mensaje = await MensajeContacto.findByPk(id);
    if (!mensaje) return res.status(404).json({ error: 'Mensaje no encontrado' });

    mensaje.estado = estado;
    await mensaje.save();

    res.status(200).json({ mensaje: 'Estado actualizado correctamente' });
  } catch (error) {
    console.error('Error al actualizar el estado del mensaje:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

module.exports = router;
