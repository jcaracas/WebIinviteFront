const express = require("express");
const Galeria = require('../models/Galeria'); // Asegúrate de que el modelo Galeria esté correctamente definido
const {upload} = require('../middlewares/multer'); // Middleware para manejar la subida de archivos
const Evento = require('../models/Event'); // Modelo de eventos, si es necesario para validaciones
const authJWT = require('../middlewares/authJWT');  
const sharp = require('sharp'); // Para procesar imágenes
const path = require('path');


const router = express.Router();

// Subir múltiples fotos
router.post('/upload/:codigo',authJWT, upload.array('photos', 10), async (req, res) => {
    const { codigo } = req.params;
    const usuario_id = req.user.id;
    const evento = await Evento.findOne({ where: { codigo } });
    if (!evento) {
        return res.status(404).json({ error: 'Evento no encontrado' });
      }
    try {
        const fotosProcesadas = [];

        for (let file of req.files) {
            try {
                const nombreFinal = Date.now() + '-' + Math.round(Math.random() * 1E9) + '.webp';
                const rutaCompleta = path.join(__dirname, '../public/uploads/galeria', nombreFinal);
        
                await sharp(file.buffer)
                    .webp({ quality: 80 })
                    .toFile(rutaCompleta);
        
                fotosProcesadas.push({
                    evento_id: evento.id,
                    usuario_id: usuario_id,
                    imagen_url: nombreFinal
                });
            } catch (err) {
                console.error(`Error procesando imagen individual (${file.originalname}):`, err.message);
            }
        }

        const nuevasFotos = await Galeria.bulkCreate(fotosProcesadas);
        res.status(201).json(nuevasFotos);
    } catch (error) {
        console.error("Error subiendo imágenes:", error);
        res.status(500).json({ error: "No se pudo subir las imágenes" });
    }
});

// Obtener fotos de un evento
router.get('/:codigo', async (req, res) => {
    const { codigo } = req.params;
    const evento = await Evento.findOne({ where: { codigo } });
    try {
        const fotos = await Galeria.findAll({ where: { evento_id: evento.id },order: [['createdAt', 'DESC']] });
        res.json(fotos);
    } catch (error) {
        console.error("Error al obtener imágenes:", error);
        res.status(500).json({ error: "No se pudieron obtener las imágenes" });
    }
});

// Eliminar una imagen
const fs = require('fs');
router.delete('/delete/:id', async (req, res) => {
    const { id } = req.params;
    
    try {
        const imagen = await Galeria.findByPk(id);
        if (!imagen) return res.status(404).json({ error: "Imagen no encontrada" });
        
        const filePath = path.join(__dirname, '../public/uploads/galeria', imagen.imagen_url);
        // Eliminar archivo físicamente
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath); // Eliminar archivo físico
        } else {
            console.warn('Archivo no encontrado físicamente:', filePath);
        }

        // Eliminar de la base de datos
        await imagen.destroy();
        res.json({ mensaje: "Imagen eliminada correctamente" });
    } catch (error) {
        console.error("Error al eliminar imagen:", error);
        res.status(500).json({ error: "No se pudo eliminar la imagen" });
    }
});

// Marcar o desmarcar imagen como favorita
router.put('/favorito/:id', authJWT, async (req, res) => {
    const { id } = req.params;
    try {
        const imagen = await Galeria.findByPk(id);

        if (!imagen) {
            return res.status(404).json({ error: 'Imagen no encontrada' });
        }

        // Cambia el estado del favorito
        imagen.favorito = !imagen.favorito;
        await imagen.save();

        res.json({ mensaje: 'Estado favorito actualizado', favorito: imagen.favorito });
    } catch (error) {
        console.error('Error al actualizar favorito:', error);
        res.status(500).json({ error: 'No se pudo actualizar el estado favorito' });
    }
});

// Obtener imágenes favoritas de un evento
router.get('/favoritas/:codigo', authJWT, async (req, res) => {
    const { codigo } = req.params;
    try {
        const { page = 1, limit = 8 } = req.query;
        const currentPage = parseInt(page, 10);
        const perPage = parseInt(limit, 10);
        const offset = (currentPage - 1) * perPage;

        const evento = await Evento.findOne({ where: { codigo } });
        if (!evento) return res.status(404).json({ error: 'Evento no encontrado' });

        const { rows: favoritas, count: total } = await Galeria.findAndCountAll({
            where: {
                evento_id: evento.id,
                favorito: true
            },
            limit: perPage,
            offset,
            order: [['createdAt', 'DESC']]
        });

        const totalPages = Math.ceil(total / perPage);

        res.json({
            favoritas,
            total,
            totalPages,
            currentPage
        });

    } catch (error) {
        console.error("Error al obtener favoritas:", error);
        res.status(500).json({ error: "No se pudieron obtener las favoritas" });
    }
});


module.exports = router;