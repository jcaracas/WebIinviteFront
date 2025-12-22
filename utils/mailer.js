const nodemailer = require('nodemailer');


const transporter = nodemailer.createTransport({
  service: 'Gmail', // Puedes usar otro (ej: outlook, mailtrap, etc)
  auth: {
    user: process.env.EMAIL_USER, // Usa variables de entorno seguras
    pass: process.env.EMAIL_PASS
  }
});

async function enviarCorreo({ to, subject, html, attachments = []}) {
  try {
    const info = await transporter.sendMail({
      from: '"WedInvite" <no-reply@wedinvite.com>',
      to,
      subject,
      html,
      attachments // Se incluye aquí el adjunto si es necesario
    });

    return { exito: true, mensajeId: info.messageId };
  } catch (error) {
    console.error("Error al enviar correo:", error);
    return { exito: false, error };
  }
}


module.exports = {enviarCorreo};
