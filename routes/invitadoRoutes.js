const express = require("express");
const Invitado = require("../models/Invitado");
const Evento = require("../models/Event");
const User = require("../models/User"); 
const LikeComentario = require("../models/LikeComentario");
const Notificaciones = require("../models/Notificacion");
const authJWT = require("../middlewares/authJWT");
const generarPassword = require("../utils/generarPassword");
const router = express.Router();
const {enviarCorreo} = require("../utils/mailer"); // Asegúrate de tener esta función para enviar correos
const bcrypt = require('bcrypt');
const XLSX = require('xlsx');
const { Sequelize, Op } = require('sequelize');


router.post('/respuesta', async (req, res) => {
  const { nombre, email, codigo, estado_confirmacion, acompanantes, comentario } = req.body;

  try {
    // Validar campos obligatorios
    if (!nombre || !email || !codigo || !estado_confirmacion) {
      return res.status(400).json({ mensaje: "Faltan datos obligatorios." });
    }

    // Buscar el evento
    const evento = await Evento.findOne({ where: { codigo } });
    if (!evento) {
      return res.status(404).json({ mensaje: "Evento no encontrado." });
    }

    if (evento.estado !== 'Activo') {
      return res.status(403).json({ mensaje: "Este evento no está disponible para confirmar asistencia." });
    }

    // Validar si el invitado ya respondió previamente
    const yaRegistrado = await Invitado.findOne({
      where: {
        email,
        evento_id: evento.id
      }
    });

    if (yaRegistrado) {
      return res.status(409).json({ mensaje: "Ya has respondido a esta invitación anteriormente. Para cambiar el estado debes iniciar sesión." });
    }

    // Crear nuevo invitado
    await Invitado.create({
      nombre,
      email,
      acompanantes,
      estado_confirmacion,
      evento_id: evento.id,
      comentario
    });
    const mensaje = `${nombre} ha ${estado_confirmacion } su asistencia.`;


    // Si no rechazó, crear usuario y enviar correo
    if (estado_confirmacion.toLowerCase() !== 'rechazado') {
      let usuario = await User.findOne({ where: { email } });

      if (!usuario) {
        const passwordGenerada = generarPassword(); // Función que debes tener definida
        const hash = await bcrypt.hash(passwordGenerada, 10);

        usuario = await User.create({
          nombre,
          email,
          contrasenia: hash,
          tipo_usuario: 'Invitado'
        });

        // Responder al cliente inmediatamente
        res.status(200).json({ mensaje: 'Tu respuesta ha sido registrada. Revisa tu correo con tus credenciales.' });

        // Enviar correo en segundo plano
        enviarCorreo({
          to: email,
          subject: 'Confirmación de asistencia y acceso',
          html: `<p>Gracias por confirmar tu asistencia al evento "${evento.titulo}".</p>
                <p>Tu acceso ha sido creado. Aquí están tus credenciales:</p>
                <ul>
                  <li><strong>Email:</strong> ${email}</li>
                  <li><strong>Contraseña:</strong> ${passwordGenerada}</li>
                </ul>`
        }).then(resultado => {
          if (!resultado.exito) {
            console.error("❌ Error al enviar correo:", resultado.error);
          } else {
            console.log("✅ Correo enviado a", email);
          }
        }).catch(err => {
          console.error("❌ Error inesperado al enviar correo:", err);
        });



      } else {
        // Usuario ya existe
        res.status(200).json({ mensaje: 'Tu respuesta ha sido registrada. Ya tienes acceso, revisa tu correo.' });

        // Enviar correo en segundo plano
        enviarCorreo({
          to: email,
          subject: 'Confirmación de asistencia',
          html: `<p>Gracias por confirmar tu asistencia al evento "${evento.titulo}".</p>
                <p>Ya cuentas con acceso. Si olvidaste tu contraseña puedes recuperarla desde el sitio web.</p>`
        }).then(resultado => {
          if (!resultado.exito) {
            console.error("❌ Error al enviar correo:", resultado.error);
          } else {
            console.log("✅ Correo enviado a", email);
          }
        }).catch(err => {
          console.error("❌ Error inesperado al enviar correo:", err);
        });
      }

    } else {
      // Invitado rechazó la invitación
      return res.status(200).json({ mensaje: 'Tu respuesta ha sido registrada. Lamentamos no verte en el evento.' });
    }
    await Notificaciones.create({
      mensaje,
      usuario_id: evento.cliente_id,
      evento_id: evento.id,
      leido: false
  });

  } catch (error) {
    console.error("❌ Error general:", error);
    return res.status(500).json({ mensaje: "Error interno del servidor." });
  }
});


// Obtener invitados por evento para usuario tipo Novia
router.get('/evento/:codigo', async (req, res) => {
  const { codigo } = req.params;

  try {
    const evento = await Evento.findOne({ where: { codigo } });
    if (!evento) return res.status(404).json({ mensaje: 'Evento no encontrado' });

    const invitados = await Invitado.findAll({
      where: { evento_id: evento.id },
      order: [['updatedAt', 'DESC']]
    });

    const resultado = await Promise.all(
      invitados.map(async (inv) => {
        const likes = await LikeComentario.count({ where: { invitado_id: inv.id } });

        return {
          id: inv.id,
          nombre: inv.nombre,
          comentario: inv.comentario,
          favorito: inv.favorito,
          createdAt: inv.createdAt,
          updatedAt: inv.updatedAt,
          acompanantes: inv.acompanantes,
          estado_confirmacion: inv.estado_confirmacion,
          email: inv.email,
          mesa: inv.mesa,
          likes
        };
      })
    );
    
    res.json(resultado);
  } catch (error) {
    console.error('Error al obtener invitados:', error);
    res.status(500).json({ mensaje: 'Error interno del servidor' });
  }
});


router.post('/enviar-excel', authJWT, async (req, res) => {
  const { codigo } = req.body;
  const email = req.user.email; // Se extrae directamente del token

  if (!email || !codigo) {
    return res.status(400).json({ mensaje: "Faltan datos requeridos." });
  }

  console.log("Código del evento:", codigo);
  console.log("Email del usuario:", email);

  try {
    const evento = await Evento.findOne({ where: { codigo } });
    if (!evento) return res.status(404).json({ mensaje: "Evento no encontrado." });

    const invitados = await Invitado.findAll({ where: { evento_id: evento.id } });

    const data = invitados.map(inv => ({
      Nombre: inv.nombre,
      Email: inv.email,
      Acompañantes: inv.acompanantes,
      Estado: inv.estado_confirmacion,
      Comentario: inv.comentario || '',
      Mesa: inv.mesa || ''
    }));

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Invitados");

    const buffer = XLSX.write(wb, { bookType: 'xlsx', type: 'buffer' });

    const resultadoEnvio = await enviarCorreo({
      to: email,
      subject: `Lista de invitados - ${evento.titulo}`,
      html: `<p>Hola,</p><p>Adjuntamos el archivo Excel con la lista de invitados del evento <strong>${evento.titulo}</strong>.</p>`,
      attachments: [{
        filename: `invitados-${evento.titulo}.xlsx`,
        content: buffer,
        contentType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      }]
    });

    if (!resultadoEnvio.exito) {
      console.error("Error al enviar correo:", resultadoEnvio.error);
      return res.status(500).json({ mensaje: "Error al enviar el correo." });
    } 

    res.json({ mensaje: "Archivo Excel enviado exitosamente al correo." });

  } catch (error) {
    console.error("Error al enviar Excel:", error);
    res.status(500).json({ mensaje: "Error interno del servidor." });
  }
});

router.get('/estado/:codigo', authJWT, async (req, res) => {
  try {
    const { codigo } = req.params;

    // Busca el evento por código
    const evento = await Evento.findOne({ where: { codigo: codigo } });
    if (!evento) return res.status(404).json({ error: 'Evento no encontrado' });

    // Agrupa por estado_confirmacion
    const invitados = await Invitado.findAll({
      where: { evento_id: evento.id },
      attributes: ['estado_confirmacion', [Sequelize.fn('COUNT', Sequelize.col('estado_confirmacion')), 'total']],
      group: ['estado_confirmacion']
    });

    // Formato de respuesta: { Confirmado: 10, Pendiente: 5, Rechazado: 2 }
    const resultado = {};
    invitados.forEach(inv => {
      resultado[inv.estado_confirmacion] = parseInt(inv.dataValues.total);
    });

    res.json(resultado);
  } catch (error) {
    console.error('Error al obtener resumen:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

router.post("/asignar-mesas",authJWT, async (req, res) => {
  const asignaciones = req.body; // [{ id: uuid, mesa: 2 }, ...]
  try {
      for (const asignacion of asignaciones) {
          await Invitado.update(
              { mesa: asignacion.mesa },
              { where: { id: asignacion.id } }
          );
      }

      res.status(200).json({ message: "Asignaciones guardadas correctamente." });
  } catch (error) {
      console.error("Error en asignación de mesas:", error);
      res.status(500).json({ message: "Error al asignar mesas." });
  }
});


module.exports = router;
