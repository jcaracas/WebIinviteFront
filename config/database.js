const { Sequelize } = require("sequelize");

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  String(process.env.DB_PASSWORD), // Asegura que la contraseña sea un string
  {
    host: process.env.DB_HOST,
    dialect: "postgres",
    port: process.env.DB_PORT,
    logging: false,
  }
);

sequelize
  .authenticate()
  .then(() => console.log("Conexión a PostgreSQL exitosa ✅"))
  .catch((err) => console.error("Error al conectar a la BD ❌", err));

module.exports = sequelize;
