const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Confirmacion = sequelize.define('Confirmacion', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  usuario_id: {
    type: DataTypes.UUID,
    allowNull: false
  },
  evento_id: {
    type: DataTypes.UUID,
    allowNull: false
  },
  estado: {
    type: DataTypes.ENUM('Confirmado', 'Pendiente', 'Rechazado'),
    allowNull: false
  },
  comentario: {
    type: DataTypes.STRING,
    allowNull: true,
  },
}, {
  tableName: 'confirmaciones',
  timestamps: true
});

module.exports = Confirmacion;
