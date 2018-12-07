const request = require('supertest');
const server = require('../src/server');
const Check = require('../src/components/checks/check.entity');
const { getToken, createUser } = require('./helpers');
const HttpError = require('../src/helpers/http/http-error');

const checkData = {
  protocol: 'http',
  url: 'google.com',
  method: 'get',
  successCodes: [200, 204],
  timeoutSeconds: 3
};

const resultCheck = new Check({
  ...checkData,
});

describe('/checks', () => {

  let checkId;
  let userData = {
    firstName: 'Alan',
    lastName: 'Cooper',
    email: 'gogunov00@gmail.com',
    password: '123456'
  };

  beforeAll(async () => {
    await server.run();
  });

  afterAll(async () => {
    server.stop();
  });

  // describe('Authorized requests', () => {
  //   let token;
  //
  //   beforeEach(async () => {
  //     if(!token) {
  //       await createUser(userData);
  //       token = await getToken(userData.email, userData.password);
  //     }
  //   });

    // describe('POST', () => {

    //   it('should create new check', async () => {
    //     const { body } = await request(server.httpServer)
    //       .post('/checks')
    //       .send(checkData)
    //       .set('Authorization', `Bearer ${token}`)
    //       .expect('Content-Type', /json/);
    //
    //     console.log('Body', body);
    //
    //     checkId = body.id;
    //
    //     expect(body).toEqual(resultCheck);
    //   });
    //
    // });

    // describe('PUT', () => {
    //   const dataToUpdate = {
    //     protocol: 'https',
    //     url: 'yahoo.com'
    //   };
    //
    //   const updatedData = new Check({
    //     ...resultCheck,
    //     ...dataToUpdate,
    //   });
    //
    //   it('should update particular check by id', async () => {
    //
    //     const { body } = await request(server.httpServer)
    //       .put(`/checks/${checkId}`)
    //       .send(dataToUpdate)
    //       .set('Authorization', `Bearer ${token}`)
    //       .expect('Content-Type', /json/);
    //
    //     expect(body).toEqual(updatedData);
    //   });
    //
    //   it('should throw an error array of users if token is not provided', async () => {
    //     const { body } = await request(server.httpServer)
    //       .put(`/checks/${checkId}`)
    //       .send(checkData)
    //       .expect(401)
    //       .expect('Content-Type', /json/);
    //
    //     expect(body).toEqual(new HttpError('Invalid authorization token'));
    //   });
    //
    // });
    //
    // describe('GET', () => {
    //
    //   it('should get array of checks if token is provided', async () => {
    //     const { body } = await request(server.httpServer)
    //       .get('/checks')
    //       .send(checkData)
    //       .set('Authorization', `Bearer ${token}`)
    //       .expect('Content-Type', /json/);
    //
    //     expect(Array.isArray(body)).toBe(true);
    //   });
    //
    //   it('should throw an error array of checks if token is not provided', async () => {
    //     const { body } = await request(server.httpServer)
    //       .get('/checks')
    //       .expect(401)
    //       .expect('Content-Type', /json/);
    //
    //     expect(body).toEqual(new HttpError('Invalid authorization token'));
    //   });
    //
    // });
    //
    // describe('DELETE', () => {
    //
    //   it('should remove check by particular id', async () => {
    //     await request(server.httpServer)
    //       .delete(`/checks/${checkId}`)
    //       .set('Authorization', `Bearer ${token}`)
    //       .expect('Content-Type', /json/);
    //
    //     const { body } = await request(server.httpServer)
    //       .get('/checks')
    //       .send(checkData)
    //       .set('Authorization', `Bearer ${token}`)
    //       .expect('Content-Type', /json/);
    //
    //     expect(body.length).toBe(0);
    //   });
    //
    //   it('should throw an error array of users if token is not provided', async () => {
    //     const { body } = await request(server.httpServer)
    //       .delete(`/checks/${checkId}`)
    //       .expect(401)
    //       .expect('Content-Type', /json/);
    //
    //     expect(body).toEqual(new HttpError('Invalid authorization token'));
    //   });
    //
    // });

  // });

});
