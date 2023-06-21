const request = require('supertest');
const app = require('./index');

describe('Test de /pedido', () => {
  it('Debe crear un pedido y retornar el ID del pedido', async () => {
    // Realiza la solicitud POST al endpoint /pedido
    const response = await request(app)
      .post('/pedido');

    // Verifica la respuesta y el ID del pedido retornado
    expect(response.status).toBe(200);
    expect(response.body.msg).toBe('Pedido solicitado por cliente. ');
    expect(response.body.pedidoId).toBeDefined();
  });
});
