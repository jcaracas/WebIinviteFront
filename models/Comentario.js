const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Comentario = sequelize.define("Comentario", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  evento_id: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  usuario_id: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  contenido: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
}, { 
  tableName: "Comentarios",
  timestamps: true 
});

module.exports = Comentario;
