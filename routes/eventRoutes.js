const express = require("express");
const Event = require("../models/Event");
const authJWT = require('../middlewares/authJWT');  
const verificarRol = require('../middlewares/verificarRol'); // Middleware para verificar roles
const Cliente = require("../models/Cliente"); // Asegúrate de importar tu modelo Cliente
const User = require("../models/User"); // Asegúrate de importar tu modelo User
const { Op } = require("sequelize"); // Asegúrate de importar Sequelize si lo usas para las consultas



const router = express.Router();

// 🔹 Crear un evento
router.post("/",  async (req, res) => {
  
  try {
    const evento = await Event.create(req.body);
    res.status(201).json(evento);
    } catch (error) {
     
    res.status(500).json({ error: error.message });
  }
});

// 🔹 Obtener eventos de un usuario
router.get("/usuario/:usuario_id", async (req, res) => {
  try {
    const eventos = await Event.findAll({ where: { usuario_id: req.params.usuario_id } });
    res.json(eventos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 🔹 Eliminar un evento
router.delete("/:id", async (req, res) => {
  try {
    await Event.destroy({ where: { id: req.params.id } });
    res.json({ mensaje: "Evento eliminado" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/proximos', authJWT,  async (req, res) => {
  try {
    const rangoDias = parseInt(req.query.rangoDias) || 7;

    const fechaInicio = new Date(); // hoy
    const fechaFin = new Date();
    fechaFin.setDate(fechaFin.getDate() + rangoDias); // hoy + N días

    const eventos = await Event.findAll({
      where: {
        fecha_inicio: {
          [Op.gte]: fechaInicio,
          [Op.lte]: fechaFin,
        }
      },
      include: [{
        model: Cliente,
        as: 'Cliente',
        attributes: ['nombre']
      }]
    });

    const eventosFormateados = eventos.map(evento => ({
      id: evento.id,
      titulo: evento.titulo,
      tipo: evento.tipo,
      fecha_inicio: evento.fecha_inicio,
      hora_inicio: evento.hora_inicio,
      nombreCliente: evento.Cliente ? evento.Cliente.nombre : 'Desconocido'
    }));

    res.json(eventosFormateados);
  } catch (error) {
    console.error('Error al obtener eventos próximos:', error);
    res.status(500).json({ error: 'Error al obtener eventos próximos' });
  }
});

router.get('/', authJWT, async (req, res) => {
  try {
    const eventos = await Event.findAll({
      include: [
        {
          model: Cliente,
          attributes: ['nombre']
        },
        {
          model: User,
          attributes: ['nombre']
        }
      ]
    });
    res.json(eventos);
  } catch (error) {
    console.error('Error al obtener eventos:', error);
    res.status(500).json({ mensaje: 'Error al obtener eventos' });
  }
});

module.exports = router;
