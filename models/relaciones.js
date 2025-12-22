const User = require('./User');
const Cliente = require('./Cliente');
const Evento = require('./Event');
const Invitado = require('./Invitado');
const Comentario = require('./Comentario');
const LikeComentario = require('./LikeComentario');
const Confirmacion = require('./Confirmacion');
const Galeria = require('./Galeria');
const Notificacion = require('./Notificacion');
const Regalo = require('./Regalo'); // Asegúrate de tener este modelo definido

// Relación: Cliente -> Eventos
Cliente.hasMany(Evento, { foreignKey: 'cliente_id', onDelete: 'CASCADE' });
Evento.belongsTo(Cliente, { foreignKey: 'cliente_id' });

// Relación: Usuario -> Eventos (usuario puede crear eventos)
User.hasMany(Evento, { foreignKey: 'usuario_id', onDelete: 'CASCADE' });
Evento.belongsTo(User, { foreignKey: 'usuario_id' });

// Relación: Evento -> Invitados
Evento.hasMany(Invitado, { foreignKey: 'evento_id', onDelete: 'CASCADE' });
Invitado.belongsTo(Evento, { foreignKey: 'evento_id' });

// Relación: Evento -> Comentarios
Evento.hasMany(Comentario, { foreignKey: 'evento_id', onDelete: 'CASCADE' });
Comentario.belongsTo(Evento, { foreignKey: 'evento_id' });

// Relación: Usuario -> Comentarios
User.hasMany(Comentario, { foreignKey: 'usuario_id', onDelete: 'CASCADE' });
Comentario.belongsTo(User, { foreignKey: 'usuario_id' });

// Relación: Comentario -> Likes
User.hasMany(LikeComentario, { foreignKey: 'usuario_id' });
LikeComentario.belongsTo(User, { foreignKey: 'usuario_id' });

Invitado.hasMany(LikeComentario, { foreignKey: 'invitado_id' });
LikeComentario.belongsTo(Invitado, { foreignKey: 'invitado_id' });

// Relación: Evento -> Confirmaciones
Evento.hasMany(Confirmacion, { foreignKey: 'evento_id', onDelete: 'CASCADE' });
Confirmacion.belongsTo(Evento, { foreignKey: 'evento_id' });

// Relación: Usuario -> Confirmaciones
User.hasMany(Confirmacion, { foreignKey: 'usuario_id', onDelete: 'CASCADE' });
Confirmacion.belongsTo(User, { foreignKey: 'usuario_id' });

// Relación: Evento -> Galeria (fotos del evento)
Evento.hasMany(Galeria, { foreignKey: 'evento_id', onDelete: 'CASCADE' });
Galeria.belongsTo(Evento, { foreignKey: 'evento_id' });

// Relación: Evento -> Notificaciones
Evento.hasMany(Notificacion, { foreignKey: 'evento_id', onDelete: 'CASCADE' });
Notificacion.belongsTo(Evento, { foreignKey: 'evento_id' });

User.belongsToMany(Evento, { through: "EventoUsuario", foreignKey: "usuario_id" });
Evento.belongsToMany(User, { through: "EventoUsuario", foreignKey: "evento_id" });

User.hasMany(Evento, { foreignKey: "creado_por" }); // Creador del evento (Admin o Asesor)
Evento.belongsTo(User, { foreignKey: "creado_por", as: "creador" });

// Evento tiene muchos regalos
Evento.hasMany(Regalo, {  foreignKey: 'evento_id',  as: 'regalos', onDelete: 'CASCADE'});
// Regalo pertenece a un evento
Regalo.belongsTo(Evento, { foreignKey: 'evento_id', as: 'evento'});


module.exports = {
  User,
  Cliente,
  Evento,
  Invitado,
  Comentario,
  LikeComentario,
  Confirmacion,
  Galeria,
  Notificacion,
  Regalo
};
