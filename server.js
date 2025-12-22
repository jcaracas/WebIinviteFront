require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
require('./models/relaciones');



const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

// Ruta de prueba
app.get("/", (req, res) => {
  res.send("¡Bienvenido a WedInvite Backend!");
});
const sequelize = require('./config/database');

sequelize.sync({ alter: true })
  .then(() => console.log("🟢 Base de datos sincronizada"))
  .catch(err => console.error("❌ Error al sincronizar BD:", err));

const userRoutes = require("./routes/userRoutes");
const eventRoutes = require("./routes/eventRoutes");
const invitadoRoutes = require("./routes/invitadoRoutes");
const comentarioRoutes = require("./routes/comentarioRoutes");
const notificacionRoutes = require("./routes/notificacionRoutes");
const contactoRoutes = require('./routes/contacto');
const clienteRoutes = require('./routes/clienteRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes'); // Importa las rutas del dashboard
const regalosRoutes = require('./routes/regalosRoutes'); // Importa las rutas de regalos
const likesRoutes = require('./routes/likesRoutes'); // Importa las rutas de likes
const galeriaRoutes = require('./routes/galeriaRoutes'); // Importa las rutas de galería


app.use(express.json());
app.use(express.urlencoded({ extended: true }));



app.use("/api/usuarios", userRoutes);
app.use("/api/eventos", eventRoutes);
app.use("/api/invitados", invitadoRoutes);
app.use("/api/comentarios", comentarioRoutes);
app.use("/api/notificaciones", notificacionRoutes);
app.use("/api/contacto", contactoRoutes);
app.use("/api/clientes", clienteRoutes);
app.use("/api/dashboard", dashboardRoutes); // Usa las rutas del dashboard
app.use("/api/regalos", regalosRoutes); // Usa las rutas de regalos
app.use("/api/likes", likesRoutes); // Usa las rutas de likes
app.use('/api/galeria', galeriaRoutes); // Usa las rutas de galería




// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
