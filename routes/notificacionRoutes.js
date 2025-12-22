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

module.exports = router;
