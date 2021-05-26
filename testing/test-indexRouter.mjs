import util from 'util';
import Chai from 'chai';
import chaiHttp from 'chai-http';
import { app } from '../app.mjs';
import dotenv from 'dotenv';
import { useUserModel as useUserModel } from '../models/books-store.mjs';

dotenv.config();
Chai.use(chaiHttp);
const expect = Chai.expect;
let userStore;

describe('Initialize', function() {
  this.timeout(100000);
  it('should successfully load the User model', async function() {
    try {
      // Initialize just as in app.mjs
      // If these execute without exception the test succeeds
      userStore = await useUserModel();
    } catch (e) {
      console.error(e);
      throw e;
    }
  });
});

describe('Index Router', function() {
  context('GET without session', function() {
    it('root path should redirect to login', async () => {
      Chai.request(app)
        .get('/')
        .end(function(err, res) {
          expect(err).to.be.null;
          expect(res).to.redirect;
          expect(res).to.have.status(200);
        })
    });

    it('login path should redirect to login', async () => {
      Chai.request(app)
        .get('/login')
        .end(function(err, res) {
          expect(err).to.be.null;
          expect(res).to.have.status(200);
          expect(res.text).to.have.include('Login');
        })
    });

    it('register path should redirect to register', async () => {
      Chai.request(app)
        .get('/register')
        .end(function(err, res) {
          expect(err).to.be.null;
          expect(res).to.have.status(200);
          expect(res.text).to.have.include('Register');
        })
    });
  });

  context('POST to login', function() {
    let testUser;
    before(async function() {
      testUser = await userStore.create('test1@gmail.com', '123456', 'testUser1');
    });

    it('login path should redirect to root path /', async () => {
      await Chai.request.agent(app)
        .post('/login')
        .send({email: testUser.email, password: testUser.password})
        .end(function(err, res) {
          expect(err).to.be.null;
          expect(res.text).to.have.include('Library');
          expect(res).to.have.status(200);
        })
    });

    after(async function() {
      const keyz = await userStore.keylist();
      for (let key of keyz) {
        await userStore.destroy(key);
      }
    });
  });

  context('GET with a session', function() {
    let testUser;
    let agent = Chai.request.agent(app);
    before(async function() {
      testUser = await userStore.create('test1@gmail.com', '123456', 'testUser1');
      await agent.post('/login')
        .send({email: testUser.email, password: testUser.password});
    });

    it('root path should have a 200 status', async () => {
      const authenticatedResponse = await agent.get('/');
      expect(authenticatedResponse.text).to.have.include('Library');
      expect(authenticatedResponse).to.have.status(200);
    });

    it('login path should redirect to root path', async () => {
      const authenticatedResponse = await agent.get('/login');
      expect(authenticatedResponse.text).to.have.include('Library');
      expect(authenticatedResponse).to.have.status(200);
    });

    it('register path should redirect to register', async () => {
      const authenticatedResponse = await agent.get('/register');
      expect(authenticatedResponse.text).to.have.include('Library');
      expect(authenticatedResponse).to.have.status(200);
    });

    it('logout path should redirect to login', async () => {
      const authenticatedResponse = await agent.get('/logout');
      expect(authenticatedResponse.text).to.have.include('Login');
      expect(authenticatedResponse).to.have.status(200);
    });
  });
  
  after(async function() {
    const keyz = await userStore.keylist();
    for (let key of keyz) {
      await userStore.destroy(key);
    }
  });
});