const express = require('express');
const winston = require('winston');
const fs = require('fs');
const app = express();
const PORT = 3002;
app.use(express.json())
// Configuración de Winston para guardar logs en un archivo
const logFilePath = 'logs/restaurante.log';
if (!fs.existsSync('logs')) {
  fs.mkdirSync('logs');
}
const logger = winston.createLogger({
  transports: [
    new winston.transports.File({ filename: logFilePath })
  ]
});

// Almacena el estado de los pedidos en memoria (simulación de base de datos)
const pedidos = {};

// Middleware para registrar los logs
app.use((req, res, next) => {
  logger.info(`[${req.method}] ${req.url}`);
  next();
});

// Ruta para recibir un pedido del cliente
app.post('/pedido', (req, res) => {
  try {
    const pedidoId = generatePedidoId();
    pedidos[pedidoId] = { estado: 'pendiente' };
    logger.info(`[Input] ${JSON.stringify(req.body)}  [Output]Pedido recibido del cliente. ID: ${pedidoId} Estado: ${pedidos[pedidoId].estado}`);
    res.json({ msg: "Pedido recibido por restaurante, en preparación. ", pedidoId});
  } catch (error) {
    console.log(error)
    logger.error('Error al recibir el pedido del cliente', { error });
    res.status(500).json({ error: 'Error al recibir el pedido del cliente' });
  }
});

// Ruta para verificar el estado del pedido al cliente
app.post('/cliente', (req, res) => {
  const pedidoId = req.body.pedidoId;

  try {
    if (!pedidos[pedidoId]) {
      logger.error(`Input] ${JSON.stringify(req.body)}  [Output]Pedido no encontrado. ID: ${pedidoId}`);
      return res.status(404).json({ error: 'Pedido no encontrado' });
    }

    logger.info(`Input] ${JSON.stringify(req.body)}  [Output] Estado del pedido actualizado. ID: ${pedidoId}, Estado: ${pedidos[pedidoId].estado}`);
    res.json({msg: "Su pedido esta en proceso", estadoPedido: pedidos[pedidoId].estado });
  } catch (error) {
    logger.error(`[Input] ${JSON.stringify(req.body)}  [Output]Error al informar el estado del pedido al cliente ${ error }`);
    res.status(500).json({ error: 'Error al informar el estado del pedido al cliente' });
  }
});

// Ruta para vericar al repartidor que el pedido está listo
app.post('/repartidor', (req, res) => {
  const pedidoId = req.body.pedidoId;

  try {
    if (!pedidos[pedidoId]) {
      logger.error(`[Input] ${JSON.stringify(req.body)} Pedido no encontrado. ID: ${pedidoId}`);
      return res.status(404).json({ error: 'Pedido no encontrado' });
    }

    pedidos[pedidoId].estado = 'Pedido Listo';
    logger.info(`Input] ${JSON.stringify(req.body)}  [Output] Estado del pedido actualizado. ID: ${pedidoId}, Estado: ${pedidos[pedidoId].estado}`);
    res.json({ msg: "El pedido esta listo para repartidor", estadoPedido: pedidos[pedidoId].estado });
  } catch (error) {
    logger.error(`[Input] ${JSON.stringify(req.body)}  [Output] Error al notificar al repartidor, ${ error }`);
    res.status(500).json({ error: 'Error al notificar al repartidor' });
  }
});

// Función para generar un ID de pedido único
function generatePedidoId() {
  return Math.random().toString(36).substr(2, 9);
}

app.listen(PORT, () => {
  console.log(`Microservicio Cliente iniciado en el puerto ${PORT}`);
});
