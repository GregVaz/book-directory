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

  context('POST to save user', function() {
    let testUser;
    before(async function() {
      testUser = await userStore.create('test1@gmail.com', '123456', 'testUser1');
    });

    it('register a user should redirect to login path', async () => {
      await Chai.request(app)
        .post('/users/save')
        .send({email: 'test2@gmail.com', password: '123456', username: 'testUser2'})
        .end(function(err, res) {
          expect(err).to.be.null;
          expect(res).to.redirect;
          expect(res.text).to.have.include('Login');
          expect(res).to.have.status(200);
        })
    });

    it('register a user with a repetead email should render the page and display a error message', async () => {
      await Chai.request(app)
        .post('/users/save')
        .send({email: testUser.email, password: '123456', username: 'testUser2'})
        .end(function(err, res) {
          console.log(err);
          expect(err).to.be.null;
          expect(res.text).to.have.include('Register');
          expect(res.text).to.have.include('The email already exists');
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

});
