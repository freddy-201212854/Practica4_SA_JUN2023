const express = require('express');
const winston = require('winston');
const fs = require('fs');
const app = express();
const PORT = 3003;
app.use(express.json())
// Configuración de Winston para guardar logs en un archivo
const logFilePath = 'logs/repartidor.log';
if (!fs.existsSync('logs')) {
  fs.mkdirSync('logs');
}
const logger = winston.createLogger({
  transports: [
    new winston.transports.File({ filename: logFilePath })
  ]
});

// Almacena el estado de los pedidos en memoria (simulación de base de datos)
const pedidos = {pedidoId: "zu8xbxkuu"};

// Middleware para registrar los logs
app.use((req, res, next) => {
  logger.info(`[${req.method}] ${req.url}`);
  next();
});

// Ruta para recibir un pedido del cliente
app.post('/pedido', (req, res) => {
  console.log("Entra")
  const pedidoId = req.body.pedidoId;
  console.log(pedidos.pedidoId);
  try {
    if (pedidos.pedidoId != pedidoId) {
      logger.error(`Input] ${JSON.stringify(req.body)}  [Output]Pedido no encontrado. ID: ${pedidoId}`);
      return res.status(404).json({ error: 'Pedido no encontrado' });
    }

    logger.info(`Input] ${JSON.stringify(req.body)}  [Output] Pedido recibido del cliente, Estado del pedido actualizado. ID: ${pedidoId} Pendiente`);
    res.json({msg: "Pedido recibido del cliente.", estadoPedido: "Pendiente" });
  } catch (error) {
    console.log(error);
    logger.error(`[Input] ${JSON.stringify(req.body)}  [Output]Error al recibir el estado del pedido del cliente ${ error }`);
    res.status(500).json({ error: 'Error al recibir el estado del pedido del cliente' });
  }
});
// Ruta para verificar el estado del pedido al cliente
app.post('/cliente', (req, res) => {
  const pedidoId = req.body.pedidoId;

  try {
    if (pedidos.pedidoId != pedidoId) {
      logger.error(`Input] ${JSON.stringify(req.body)}  [Output]Pedido no encontrado. ID: ${pedidoId}`);
      return res.status(404).json({ error: 'Pedido no encontrado' });
    }

    logger.info(`Input] ${JSON.stringify(req.body)}  [Output] Estado del pedido actualizado. ID: ${pedidoId} Pendiente`);
    res.json({msg: "Su pedido esta en proceso", estadoPedido: "Pendiente" });
  } catch (error) {
    logger.error(`[Input] ${JSON.stringify(req.body)}  [Output]Error al informar el estado del pedido al cliente ${ error }`);
    res.status(500).json({ error: 'Error al informar el estado del pedido al cliente' });
  }
});

// Ruta para vericar al repartidor que el pedido está listo
app.post('/marcarPedido', (req, res) => {
  const pedidoId = req.body.pedidoId;

  try {
    if (pedidos.pedidoId != pedidoId) {
      logger.error(`[Input] ${JSON.stringify(req.body)} Pedido no encontrado. ID: ${pedidoId}`);
      return res.status(404).json({ error: 'Pedido no encontrado' });
    }

    logger.info(`Input] ${JSON.stringify(req.body)}  [Output]Pedido entregado, Estado del pedido actualizado. ID: ${pedidoId}, Pedido entregado`);
    res.json({ msg: "El pedido fue entregado ", estadoPedido: "Pedido entregado" });
  } catch (error) {
    logger.error(`[Input] ${JSON.stringify(req.body)}  [Output] Error al marcar pedido como entregado, ${ error }`);
    res.status(500).json({ error: 'Error al marcar pedido como entregado' });
  }
});

app.listen(PORT, () => {
  console.log(`Microservicio repartidor iniciado en el puerto ${PORT}`);
});
