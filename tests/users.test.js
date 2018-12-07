const request = require('supertest');
const server = require('../src/server');
const User = require('../src/components/users/user.entity');
const { getToken } = require('./helpers');
const HttpError = require('../src/helpers/http/http-error');

const userData = {
  firstName: 'Alex',
  lastName: 'Morgan',
  email: 'test@gmail.com',
  password: '123456'
};

const resultUser = new User({
  ...userData,
});

delete resultUser.id;
delete resultUser.password;

describe('/users', () => {

  let userId;

  beforeAll(async () => {
    await server.run();
  });

  afterAll(async () => {
    server.stop();
  });

  describe('Unauthorized requests', () => {

    describe('POST', () => {

      it('should create new user', async () => {
        const { body } = await request(server.httpServer)
          .post('/users')
          .send(userData)
          .expect('Content-Type', /json/);

        userId = body.id;

        delete body.id;

        expect(body).toEqual(resultUser);
      });

      it('should throw an error if user already exists', async () => {
        const { body } = await request(server.httpServer)
          .post('/users')
          .send(userData)
          .expect(409)
          .expect('Content-Type', /json/);

        expect(body).toEqual(new HttpError('User already exists'));
      });

    });


  });

  describe('Authorized requests', () => {
    let token;

    beforeEach(async () => {
      if(!token) {
        token = await getToken('test@gmail.com', '123456');
      }
    });

    describe('PUT', () => {
      const dataToUpdate = {
        firstName: 'Markus',
        lastName: 'Cooper'
      };

      const updatedData = new User({
        ...resultUser,
        ...dataToUpdate,
      });

      delete updatedData.id;
      delete updatedData.password;

      it('should update particular user by id', async () => {

        const { body } = await request(server.httpServer)
          .put('/profile')
          .send(dataToUpdate)
          .set('Authorization', `Bearer ${token}`)
          .expect('Content-Type', /json/);

        delete body.id;
        delete body.password;

        expect(body).toEqual(updatedData);
      });

      it('should throw an error array of users if token is provided', async () => {
        const { body } = await request(server.httpServer)
          .put('/profile')
          .send(userData)
          .expect(401)
          .expect('Content-Type', /json/);

        expect(body).toEqual(new HttpError('Invalid authorization token'));
      });

    });

    describe('GET', () => {

      it('should get array of users if token is provided', async () => {
        const { body } = await request(server.httpServer)
          .get('/users')
          .set('Authorization', `Bearer ${token}`)
          .expect('Content-Type', /json/);

        expect(Array.isArray(body)).toBe(true);
      });

    });

    describe('DELETE', () => {

      it('should remove user by particular id', async () => {
        await request(server.httpServer)
          .delete('/users')
          .set('Authorization', `Bearer ${token}`)
          .expect('Content-Type', /json/);

        const { body } = await request(server.httpServer)
          .get('/users')
          .set('Authorization', `Bearer ${token}`)
          .expect('Content-Type', /json/);

        expect(body.length).toBe(0);
      });

      it('should throw an error array of users if token is provided', async () => {
        const { body } = await request(server.httpServer)
          .delete('/users')
          .expect(401)
          .expect('Content-Type', /json/);

        expect(body).toEqual(new HttpError('Invalid authorization token'));
      });

    });

  });

});
