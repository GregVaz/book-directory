import util from 'util';
import Chai from 'chai';
import chaiHttp from 'chai-http';
import { app } from '../app.mjs';
import dotenv from 'dotenv';
import { useUserModel as useUserModel } from '../models/books-store.mjs';
import { useBookModel as useBookModel } from '../models/books-store.mjs';

dotenv.config();
Chai.use(chaiHttp);
const expect = Chai.expect;
let userStore;
let bookStore;

describe('Initialize', function() {
  this.timeout(100000);
  it('should successfully load the Book model', async function() {
    try {
      // Initialize just as in app.mjs
      // If these execute without exception the test succeeds
      bookStore = await useBookModel();
    } catch (e) {
      console.error(e);
      throw e;
    }
  });

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

describe('Book Router', function() {
  context('Routes without session', function() {
    it('root path should redirect to login', async () => {
      Chai.request(app)
        .get('/')
        .end(function(err, res) {
          expect(err).to.be.null;
          expect(res).to.redirect;
          expect(res).to.have.status(200);
        })
    });

    it('books add path should redirect to login', async () => {
      Chai.request(app)
        .get('/books/add')
        .end(function(err, res) {
          expect(err).to.be.null;
          expect(res).to.have.status(200);
          expect(res.text).to.have.include('Login');
        })
    });

    it('books view path should redirect to login', async () => {
      Chai.request(app)
        .get('/books/view')
        .end(function(err, res) {
          expect(err).to.be.null;
          expect(res).to.have.status(200);
          expect(res.text).to.have.include('Login');
        })
    });

    it('books edit path should redirect to login', async () => {
      Chai.request(app)
        .get('/books/edit')
        .end(function(err, res) {
          expect(err).to.be.null;
          expect(res).to.have.status(200);
          expect(res.text).to.have.include('Login');
        })
    });

    it('books save path should redirect to login', async () => {
      Chai.request(app)
        .post('/books/save')
        .end(function(err, res) {
          expect(err).to.be.null;
          expect(res).to.have.status(200);
          expect(res.text).to.have.include('Login');
        })
    });

    it('books destroy path should redirect to login', async () => {
      Chai.request(app)
        .get('/books/destroy')
        .end(function(err, res) {
          expect(err).to.be.null;
          expect(res).to.have.status(200);
          expect(res.text).to.have.include('Login');
        })
    });
    
    it('books destroy confirm path should redirect to login', async () => {
      Chai.request(app)
        .get('/books/destroy/confirm')
        .end(function(err, res) {
          expect(err).to.be.null;
          expect(res).to.have.status(200);
          expect(res.text).to.have.include('Login');
        })
    });

    it('books summary pdf path should redirect to login', async () => {
      Chai.request(app)
        .get('/books/summary')
        .end(function(err, res) {
          expect(err).to.be.null;
          expect(res).to.have.status(200);
          expect(res.text).to.have.include('Login');
        })
    });

  });

  context('POST to books', function() {
    let testUser;
    let agent = Chai.request.agent(app);
    before(async function() {
      testUser = await userStore.create('test@test.test', '123456', 'testUser1');
      await agent.post('/login')
        .send({email: testUser.email, password: testUser.password});
    });

    it('book add path should have a 200 status', async () => {
      const authenticatedResponse = await agent.get('/books/add');
      expect(authenticatedResponse.text).to.have.include('Add a book');
      expect(authenticatedResponse).to.have.status(200);
    });

    it('save a book and redirect to book view path', async () => {
      await agent
        .post('/books/save')
        .send({title: 'title1',
              author: 'author1',
              publication_date: new Date().toISOString(),
              abstract: 'abstract1',
              cover: 'cover1',
              docreate: 'create',
              userId: testUser.email})
        .end(function(err, res) {
          expect(err).to.be.null;
          expect(res.text).to.have.include('title1');
          expect(res).to.have.status(200);
        })
    });

    after(async function() {
      const bookKeys = await bookStore.keylist(testUser.email);
      for (let key of bookKeys) {
        await bookStore.destroy(key);
      }
      const userKeys = await userStore.keylist();
      for (let key of userKeys) {
        await userStore.destroy(key);
      }
    });
  });

  context('GET with a session', function() {
    let testUser, testBook1, testBook2;
    let agent = Chai.request.agent(app);
    before(async function() {
      testUser = await userStore.create('test@test.test', '123456', 'testUser1');
      testBook1 = await bookStore.create('title1', 'author1', new Date().toISOString(), 'abstract1', 'cover1', testUser.email);
      testBook2 = await bookStore.create('title2', 'author2', new Date().toISOString(), 'abstract2', 'cover2', testUser.email);
      await agent.post('/login')
        .send({email: testUser.email, password: testUser.password});
    });

    it('root path should have a 200 status and show a list of user books', async () => {
      const authenticatedResponse = await agent.get('/');
      expect(authenticatedResponse.text).to.have.include('Library');
      expect(authenticatedResponse).to.have.status(200);
      expect(authenticatedResponse.text).to.have.include(testBook1.title);
      expect(authenticatedResponse.text).to.have.include(testBook2.title);
    });

    it('book view path should show book information', async () => {
      const authenticatedResponse = await agent.get('/books/view').query({id: testBook1.id});
      expect(authenticatedResponse.text).to.have.include(testBook1.title);
      expect(authenticatedResponse.text).to.have.include(testBook1.author);
      expect(authenticatedResponse).to.have.status(200);
    });

    it('book edit path should show book information', async () => {
      const authenticatedResponse = await agent.get('/books/edit').query({id: testBook1.id});
      expect(authenticatedResponse.text).to.have.include(`Edit ${testBook1.title}`);
      expect(authenticatedResponse.text).to.have.include(testBook1.title);
      expect(authenticatedResponse.text).to.have.include(testBook1.author);
      expect(authenticatedResponse.text).to.have.include(testBook1.abstract);
      expect(authenticatedResponse).to.have.status(200);
    });

    it('book destroy path should redirect to destroy confirmation path', async () => {
      const authenticatedResponse = await agent.get('/books/destroy').query({id: testBook1.id});
      expect(authenticatedResponse.text).to.have.include(testBook1.title);
      expect(authenticatedResponse).to.have.status(200);
    });

    it('book destroy confirmation path should redirect to root path and delete the book', async () => {
      const authenticatedResponse = await agent.post('/books/destroy/confirm').send({id: testBook1.id});
      expect(authenticatedResponse.text).to.have.include('Library');
      expect(authenticatedResponse).to.have.status(200);
      const books = await bookStore.keylist(testUser.email);
      expect(books).to.not.include(testBook1);
    });

    after(async function() {
      const bookKeys = await bookStore.keylist(testUser.email);
      for (let key of bookKeys) {
        await bookStore.destroy(key);
      }
      const userKeys = await userStore.keylist();
      for (let key of userKeys) {
        await userStore.destroy(key);
      }
    });
  });

});
