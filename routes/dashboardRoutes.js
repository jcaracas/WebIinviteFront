const express = require('express');
const router = express.Router();
const Cliente = require('../models/Cliente'); // Asegúrate de importar tu modelo Cliente
const MensajeContacto = require('../models/MensajeContacto'); // Asegúrate de importar tu modelo MensajeContacto  
const Event = require('../models/Event'); // Asegúrate de importar tu modelo Event
const { Op } = require('sequelize'); // Asegúrate de importar Sequelize si lo usas para las consultas
const authJWT = require('../middlewares/authJWT'); // Middleware de autenticación JWT
const verificarRol = require('../middlewares/verificarRol');// Middleware para verificar roles

router.get('/resumen', authJWT, verificarRol(['Admin', 'Asesor']), async (req, res) => {
  try {
    const totalClientes = await Cliente.count({ where: { estado: 'activo' } });
    const inicioMes = new Date();
    inicioMes.setDate(1);
    inicioMes.setHours(0, 0, 0, 0);
    const nuevosClientesMes = await Cliente.count({
      where: {
        createdAt: { [Op.gte]: inicioMes }, // Op puede variar según tu ORM (Sequelize)
        estado: 'activo' // O el estado que consideres "nuevo"
      },
    });
    const mensajesPendientes = await MensajeContacto.count({ where: { estado: 'Nuevo' } });
    const unaSemanaDespues = new Date();
    unaSemanaDespues.setDate(unaSemanaDespues.getDate() + 7);
    const eventosProximosSemana = await Event.count({
      where: {
        fecha_inicio: { [Op.lte]: unaSemanaDespues, [Op.gte]: new Date() }
      }
    });

    res.json({
      totalClientes,
      nuevosClientesMes,
      mensajesPendientes,
      eventosProximosSemana
    });    
  } catch (error) {
    console.error('Error al obtener el resumen del dashboard:', error);
    res.status(500).json({ error: 'Error al obtener el resumen del dashboard' });
  }
});

router.get('/clientes', async (req, res) => {
  try {
    const clientes = await Cliente.findAll();
    res.json(clientes);
  } catch (error) {
    console.error('Error al obtener clientes:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

module.exports = router;