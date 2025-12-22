const express = require('express');
const router = express.Router();
const LikeComentario = require('../models/LikeComentario');
const Invitado = require('../models/Invitado');
const authJWT = require("../middlewares/authJWT");

router.post('/like/:invitadoId',authJWT, async (req, res) => {
  const usuario_id = req.user.id;
  const { invitadoId } = req.params;
  try {
    // Buscar o crear el like
    const [like, created] = await LikeComentario.findOrCreate({
      where: { invitado_id: invitadoId, usuario_id: usuario_id }
    });
    // Si ya existía, lo eliminamos (toggle)
    if (!created) {
      await like.destroy();
    }

    // Recontar likes para ese invitado
    const totalLikes = await LikeComentario.count({
      where: { invitado_id: invitadoId }
    });
    // Responder con total actualizado
    res.json({ likesActualizados: totalLikes });
  } catch (err) {
    console.error("Error al actualizar like:", err);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

// Toggle favorito
router.post('/favorito/:invitadoId', authJWT, async (req, res) => {
  const { invitadoId } = req.params;

  try {
    const invitado = await Invitado.findByPk(invitadoId);
    if (!invitado) return res.status(404).json({ error: 'Invitado no encontrado' });

    // Toggle al campo favorito
    invitado.favorito = !invitado.favorito;
    await invitado.save();

    res.json({ favorito: invitado.favorito });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al actualizar favorito' });
  }
});

module.exports = router;
