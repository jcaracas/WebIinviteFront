const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Usuario = require("../models/User");
const router = express.Router();

// Validación de email
function esEmailValido(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

// 🔹 Registro de usuario
router.post('/registro', async (req, res) => {
  try {
    const { nombre, email, contrasenia, tipo_usuario } = req.body;
    if (!esEmailValido(email)) {
      return res.status(400).json({ error: 'Formato de correo inválido' });
    }

    const usuarioExistente = await Usuario.findOne({ where: { email } });
    if (usuarioExistente) {
      return res.status(400).json({ error: 'Este correo ya está registrado' });
    }

    const hashedPassword = await bcrypt.hash(contrasenia, 10);

    const user = await Usuario.create({ nombre, email, contrasenia: hashedPassword, tipo_usuario });
    console.log('Usuario creado')
    res.status(201).json({ user,  mensaje: "Usuario registrado con éxito" });
  } 
  catch (err) {
    console.error('❌ Error al registrar usuario:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// 🔹 Inicio de sesión
router.post("/login", async (req, res) => {
  const { email, contrasenia } = req.body;
  const user = await Usuario.findOne({ where: { email } });
  

  if (!user || !(await bcrypt.compare(contrasenia, user.contrasenia))) {
    return res.status(401).json({ error: "Credenciales inválidas" });
  }

  const token = jwt.sign({ id: user.id, email: user.email,tipo_usuario: user.tipo_usuario,nombre: user.nombre }, process.env.JWT_SECRET, {
    expiresIn: "24h",
  });
  
  res.json({ token, user });
  
});


// 🔹 Obtener perfil de usuario
router.get("/perfil/:id", async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ error: "Usuario no encontrado" });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
