const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const bcrypt = require('bcryptjs');


const Usuario = sequelize.define("User", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  nombre: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  contrasenia: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  tipo_usuario: {
    type: DataTypes.ENUM("Novio", "Novia", "Invitado", "Admin","Asesor"),
    defaultValue: "Invitado",
  },
}, { tableName: 'usuarios', timestamps: true });

// Método para comparar contraseña
Usuario.prototype.validarContraseña = function (contraseñaIngresada) {
  return bcrypt.compareSync(contraseñaIngresada, this.contrasenia);
};

module.exports = Usuario;
