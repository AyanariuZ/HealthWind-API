const express = require('express');
const bodyParser = require('body-parser');
const { Pool } = require('pg');

const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.json());

// Configurar la conexión a la base de datos Postgres
const pool = new Pool({
  user: 'adminhealthwind', // tu usuario de Postgres
  host: 'healthwind.postgres.database.azure.com',
  database: 'healthwind', // Nombre de la base de datos
  password: 'Healthwind01', // tu contrasenia de Postgres
  port: 5432,

  ssl: {
    rejectUnauthorized: false
}
});

// Endpoint para el registro de usuarios
app.post('/signup', async (req, res) => {
    const { nombre, correo, contrasenia } = req.body;
  
    if (!nombre || !correo || !contrasenia) {
      return res.status(400).json({ error: 'Faltan campos requeridos' });
    }
  
    try {
      const result = await pool.query(
        'INSERT INTO user (name, email, password) VALUES ($1, $2, $3) RETURNING *',
        [nombre, foto_perfil, correo, contrasenia]
      );
      res.status(201).json(result.rows[0]);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error al crear el usuario' });
    }
  });


// Endpoint para el inicio de sesión
app.post('/login', async (req, res) => {
    const { correo, contrasenia } = req.body;
  
    // Verificar que el correo y la contrasenia estén presentes
    if (!correo || !contrasenia) {
      return res.status(400).json({ error: 'Correo y contrasenia son requeridos' });
    }
  
    try {
      // Buscar al usuario en la base de datos por su correo
      const result = await pool.query('SELECT * FROM "user" WHERE email = $1', [correo]);
      console.log(result)
      console.log(contrasenia)
  
      // Si no se encuentra el usuario, devolver un mensaje de error
      if (result.rows.length === 0) {
        return res.status(400).json({ error: 'Correo o contrasenia incorrectos' });
      }
  
      const usuario = result.rows[0];
  
      // Verificar si la contrasenia ingresada coincide con la almacenada
      if (usuario.password !== contrasenia) {
        console.log("Correo o contrasenia incorrectos1")
        return res.status(400).json({ error: 'Correo o contrasenia incorrectos1' });
        
        
      }
  
      // Si la contrasenia coincide, permitir el acceso al usuario
      return res.status(200).json({ message: 'Inicio de sesión exitoso', usuario });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Error al iniciar sesión' });
    }
});

app.get('/', (req, res) => {
  res.send('Hey this is my API running 🥳')
})

app.listen(port, () => {
  console.log(`API corriendo en http://localhost:${port}`);
});

module.exports = app