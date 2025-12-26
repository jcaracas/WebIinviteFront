const express = require("express");
const Notificacion = require("../models/Notificacion");
const Evento = require("../models/Event");


const router = express.Router();

// 🔹 Obtener notificaciones de un usuario
router.get("/:codigo", async (req, res) => {
  try {
    const notificaciones = await Notificacion.findAll({ where: { codigo: req.params.codigo } });
    res.json(notificaciones);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/", async (req, res) => {
  const usuario_id = "dbe5b50f-7722-4178-b297-9ecdda2f9281";// ID de usuario simulado
  try {
    const { mensaje, evento_id } = req.body;
    const codigo= evento_id;
    // Buscar el evento
    const evento = await Evento.findOne({ where: { codigo } });
    if (!evento) {
      return res.status(404).json({ mensaje: "Evento no encontrado." });
    }

    if (!mensaje || !evento_id) {
      return res.status(400).json({
        mensaje: "Mensaje y evento_id son obligatorios"
      });
    }

    const notificacion = await Notificacion.create({
      usuario_id,
      mensaje,
      evento_id: evento.id
    });

    res.status(201).json({
      mensaje: "Notificación registrada",
      notificacion
    });

  } catch (error) {
    console.error("Error al crear notificación:", error);
    res.status(500).json({
      mensaje: "Error interno del servidor"
    });
  }
});

module.exports = router;
