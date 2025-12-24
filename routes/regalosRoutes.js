const express = require("express");
const router = express.Router();
const Regalo = require("../models/Regalo");
const { Op } = require("sequelize");    
const authJWT = require("../middlewares/authJWT");
const Evento = require("../models/Event");
const User = require("../models/User");
const multer = require('multer');
const path = require('path');

// Configuración de Multer para el almacenamiento de archivos
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
      // Define la carpeta donde se guardarán las imágenes (asegúrate de que exista)
      cb(null, path.join(__dirname, '../public/uploads'));
  },
  filename: function (req, file, cb) {
      // Define cómo se nombrará el archivo (puedes usar el nombre original con un timestamp)
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

router.get('/evento/:codigo', async (req, res) => {
  try {
    const { codigo } = req.params;
    const evento = await Evento.findOne({ where: { codigo } });

    if (!evento) {
      return res.status(404).json({ mensaje: "Evento no encontrado." });
    }

    const regalos = await Regalo.findAll({ where: { evento_id: evento.id } });
    
    res.status(200).json(regalos);

  } catch (error) {
    console.error("Error al obtener regalos:", error);
    res.status(500).json({ mensaje: "Error interno del servidor." });
  }
});

/*/ Ruta para registrar un nuevo regalo (con carga de imagen)
router.post('/', upload.single('imagen'),authJWT, async (req, res) => {
  try {
      const { titulo, enlace } = req.body;
      const { codigo } = req.body;
      
      const evento = await Evento.findOne({ where: { codigo: codigo } });// Busca el evento por código
      const imagenPath = req.file ? `/uploads/${req.file.filename}` : null; // Guarda la ruta de la imagen
      
      const nuevoRegalo = await Regalo.create({
          titulo,
          enlace,
          evento_id: evento.id, // Asocia el regalo al evento
          imagen: imagenPath, // Guarda la ruta en la base de datos
          estado: 'Disponible', // Establece el estado por defecto
      });
      
      return res.status(201).json(nuevoRegalo); // Responde con el regalo creado
  } catch (error) {
      console.error('Error al registrar el regalo:', error);
      res.status(500).json({ error: 'Error al registrar el regalo' });
  }
});*/

// Ruta para registrar un nuevo regalo (SIN carga de imagen)
router.post('/', authJWT, async (req, res) => {
  try {
    const { titulo, enlace, codigo, valor, reservado_por } = req.body;

    // Validación mínima
    if (!titulo || !enlace || !codigo || !valor || !reservado_por) {
      return res.status(400).json({ error: 'Datos incompletos' });
    }

    // Buscar evento por código
    const evento = await Evento.findOne({
      where: { codigo }
    });

    if (!evento) {
      return res.status(404).json({ error: 'Evento no encontrado' });
    }

    const nuevoRegalo = await Regalo.create({
      titulo,
      enlace,
      evento_id: evento.id,
      estado: 'Disponible',
      valor,
      reservado_por
    });

    return res.status(201).json(nuevoRegalo);

  } catch (error) {
    console.error('❌ Error al registrar el regalo:', error);
    return res.status(500).json({ error: 'Error al registrar el regalo' });
  }
});

  router.put('/regalos/:id', authJWT, async (req, res) => {
    const { id } = req.params;
    const { titulo, descripcion, enlace, estado, reservado_por } = req.body;
  
    try {
      const regalo = await Regalo.findByPk(id);
      if (!regalo) {
        return res.status(404).json({ mensaje: "Regalo no encontrado." });
      }
  
      await regalo.update({ titulo, descripcion, enlace, estado, reservado_por });
      res.status(200).json({ mensaje: "Regalo actualizado correctamente.", regalo });
    } catch (error) {
      console.error("Error al actualizar regalo:", error);
      res.status(500).json({ mensaje: "Error interno del servidor." });
    }
  });

module.exports = router;
  