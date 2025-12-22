const sequelize = require("./config/database");
const User = require("./models/User");
const Event = require("./models/Event");
const Invitado = require("./models/Invitado");
const Comentario = require("./models/Comentario");
const Notificacion = require("./models/Notificacion");

(async () => {
  try {
    await sequelize.sync({ force: true }); // Borra y crea tablas (solo para desarrollo)
    console.log("Tablas sincronizadas ✅");
  } catch (error) {
    console.error("Error al sincronizar la BD ❌", error);
  } finally {
    process.exit();
  }
})();
