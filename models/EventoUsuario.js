const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const EventoUsuario = sequelize.define("EventoUsuario", {
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
  rol_en_evento: {
    type: DataTypes.ENUM("Novio", "Novia", "Invitado"),
    allowNull: true,
  }
}, {
  tableName: 'evento_usuario',
  timestamps: false,
});

module.exports = EventoUsuario;
