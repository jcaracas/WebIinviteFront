const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const LikeComentario = sequelize.define('LikeComentario', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  usuario_id: {
    type: DataTypes.UUID,
    allowNull: false
  },
  invitado_id: {
    type: DataTypes.UUID,
    allowNull: false
  }
},  {
  tableName: 'like_comentario',
  timestamps: true,
  underscored: true
});

module.exports = LikeComentario;
