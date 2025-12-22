const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Event = sequelize.define("Event", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  usuario_id: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  cliente_id: {
    type: DataTypes.UUID,
    allowNull: false, // Si quieres permitir eventos sin cliente asignado inicialmente
  },
  titulo: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  fecha_inicio: {
    type: DataTypes.DATEONLY,
    allowNull: true,
  },
  hora_inicio: {
    type: DataTypes.TIME,
    allowNull: true,
  },
  fecha_fin: {
    type: DataTypes.DATEONLY,
    allowNull: true,
  },
  hora_fin: {
    type: DataTypes.TIME,
    allowNull: true,
  },
  ubicacion: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  tipo: {
    type: DataTypes.ENUM("Boda", "Bautizo", "Cumpleaños", "Otro"),
    allowNull: false,
  },
  estado: {
    type: DataTypes.ENUM('Pendiente', 'Activo', 'Evento Finalizado', 'Inactivo'),
    defaultValue: 'Pendiente',
  },
  link_invitacion: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  codigo: {
    type: DataTypes.STRING,
    allowNull: true,
    unique: true, // Asegura que el código sea único
  },
}, {
  tableName: 'eventos',
  timestamps: true,
});

module.exports = Event;
