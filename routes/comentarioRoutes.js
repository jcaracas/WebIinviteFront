const express = require("express");
const Comentario = require("../models/Comentario");

const router = express.Router();

// 🔹 Agregar comentario a un evento
router.post("/", async (req, res) => {
  try {
    const comentario = await Comentario.create(req.body);
    res.status(201).json(comentario);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 🔹 Obtener comentarios de un evento
router.get("/:evento_id", async (req, res) => {
  try {
    const comentarios = await Comentario.findAll({ where: { evento_id: req.params.evento_id } });
    res.json(comentarios);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
