const express = require('express');
const axios = require('axios');
const fs = require('fs');
const app = express();
const PORT = 3000;
app.use(express.json())

// Endpoint para acceder al microservicio 1
app.post('/api/cliente/:id?', async (req, res) => {
  try {
    const response = await axios.post('http://localhost:3001/' + req.params.id, req.body);
    const data = response.data;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Error al acceder al microservicio 1' });
  }
});

// Endpoint para acceder al microservicio 2
app.post('/api/restaurante/:id?', async (req, res) => {
  try {
    const response = await axios.post('http://localhost:3002/' + req.params.id, req.body);
    const data = response.data;
    res.json(data);
  } catch (error) {
    console.error('Error al acceder al microservicio 2:', error.message);
    res.status(500).json({ error: 'Error al acceder al microservicio 2' });
  }
});

// Endpoint para acceder al microservicio 3
app.post('/api/repartidor/:id?', async (req, res) => {
  try {
    const response = await axios.post('http://localhost:3003/' + req.params.id, req.body);
    console.log(response)
    const data = response.data;
    res.json(data);
  } catch (error) {
    console.error('Error al acceder al microservicio 3:', error.message);
    res.status(500).json({ error: 'Error al acceder al microservicio 3' });
  }
});

app.listen(PORT, () => {
  console.log(`Middleware iniciado en el puerto ${PORT}`);
});
