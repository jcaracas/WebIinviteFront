const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Galeria = sequelize.define('Galeria', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  evento_id: {
    type: DataTypes.UUID,
    allowNull: false
  },
  usuario_id: {
    type: DataTypes.UUID,
    allowNull: false
  },
  imagen_url: {
    type: DataTypes.STRING,
    allowNull: false
  },
  descripcion: {
    type: DataTypes.STRING,
    allowNull: true
  },favorito: {
    type: DataTypes.BOOLEAN,
    defaultValue: false, // Puedes establecer un valor por defecto (opcional)
  }
}, {
  tableName: 'galeria',
  timestamps: true
});

module.exports = Galeria;
