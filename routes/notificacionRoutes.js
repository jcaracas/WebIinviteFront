const express = require("express");
const Notificacion = require("../models/Notificacion");

const router = express.Router();

// 🔹 Obtener notificaciones de un usuario
router.get("/:usuario_id", async (req, res) => {
  try {
    const notificaciones = await Notificacion.findAll({ where: { usuario_id: req.params.usuario_id } });
    res.json(notificaciones);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const { mensaje, evento_id } = req.body;

    if (!mensaje || !evento_id) {
      return res.status(400).json({
        mensaje: "Mensaje y evento_id son obligatorios"
      });
    }

    const notificacion = await Notificacion.create({
      mensaje,
      evento_id
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
