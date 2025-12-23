import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

console.log("🔥 USANDO RESEND");

export async function enviarCorreo({ to, subject, html,attachments = [] }) {
  try {
    const { error } = await resend.emails.send({
      from: "WedInvite <onboarding@resend.dev>",
      to,
      subject,
      html,
      attachments // Se incluye aquí el adjunto si es necesario
    });

    if (error) throw error;
    console.log("📧 Correo enviado");
  } catch (err) {
    console.error("❌ Error al enviar correo:", err);
    throw err;
  }
}
