const express = require('express');
const bcrypt = require('bcrypt');
const db = require('../db');
const prisma = require('@prisma/client');

const prismaDB = new prisma.PrismaClient();
const router = express.Router();

// Ruta para registrar nuevos usuarios
router.post('/register', async (req, res) => {
  try {
    // Obtener username y password del cuerpo de la solicitud
    const { name, lastname, email, username, password } = req.body;

    if (!name | !lastname | !email | !username | !password) {
      res.status(400).send('Los campos son obligatorios');
    }
    // Hashear la contraseña antes de guardarla en la base de datos
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prismaDB.user.create({
      data: {
        name: name,
        lastname: lastname,
        email: email,
        username: username,
        password: password,
      },
    });

    if (!user) {
      res.status(500).send('No podemos crear el usuario en este momento');
    }

    res.status(200).send(user); //IMPORTANTE QUITAR LLAVE
  } catch (err) {
    // Manejo de errores generales
    console.error(err);
    res.status(500).send(err);
  }
});

module.exports = router;
