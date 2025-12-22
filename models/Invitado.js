const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Invitado = sequelize.define("Invitado", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  evento_id: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  nombre: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  estado_confirmacion: {
    type: DataTypes.ENUM("Pendiente", "Confirmado", "Rechazado"),
    defaultValue: "Pendiente",
  },
  comentario: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  acompanantes: {
    type: DataTypes.STRING,
    allowNull: true,
  },favorito: {
    type: DataTypes.BOOLEAN,
    defaultValue: false, // Puedes establecer un valor por defecto (opcional)
  },mesa: {
    type: DataTypes.INTEGER,
    allowNull: true
  }

}, { 
  tableName: 'invitados',
  timestamps: true 
});

module.exports = Invitado;
