import util from 'util';
import Chai from 'chai';
import chaiHttp from 'chai-http';
import { app } from '../app.mjs';
import dotenv from 'dotenv';

dotenv.config();
Chai.use(chaiHttp);
const expect = Chai.expect;

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
    it('login path should redirect to root path /', async () => {
      Chai.request.agent(app)
        .post('/login')
        .send({email: 'gregoriovazya@gmail.com', password: '123456'})
        .end(function(err, res) {
          expect(err).to.be.null;
          expect(res).to.redirect;
          expect(res).to.have.status(200);
        })
      // agent wit authentication
      // const authenticatedResponse = await Chai.request.agent(app).get('/login');
      // expect(authenticatedResponse).to.have.status(200);
    });
  });
});