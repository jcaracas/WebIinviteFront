const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Regalo = sequelize.define('Regalo', {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
      },
      evento_id: {
        type: DataTypes.UUID,
        allowNull: false
      },
      titulo: {
        type: DataTypes.STRING,
        allowNull: false
      },
      enlace: DataTypes.STRING,
      reservado_por: DataTypes.STRING,
      estado: {
        type: DataTypes.ENUM('Disponible', 'Reservado', 'Entregado'),
        defaultValue: 'Disponible'
      },
      // Nuevo campo para la ruta o nombre del archivo de la imagen
      imagen: {
        type: DataTypes.STRING,
        allowNull: true, // Permite que un regalo se cree sin imagen inicialmente
      },
      valor: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true // Precio del regalo obligatorio
      }
    }, {
      tableName: 'regalos', 
      timestamps: true
    });
  
 module.exports = Regalo;