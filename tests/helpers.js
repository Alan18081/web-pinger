const request = require('supertest');
const { httpServer } = require('../src/server');

exports.createUser = async (userData) => {

  try {
    const { body } = await request(httpServer)
      .post('/users')
      .send(userData);

    return body;
  } catch (e) {
    console.log('Failed to createUser', e);
  }

};

exports.getToken = async (email, password) => {

  try {
    const { body } = await request(httpServer)
      .post('/login')
      .send({ email, password });

    return body.token;
  } catch (e) {
    console.log('Failed to get token', e);
  }

};