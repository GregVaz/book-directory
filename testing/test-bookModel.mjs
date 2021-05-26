import util from 'util';
import Chai from 'chai';
import { useBookModel as useBookModel } from '../models/books-store.mjs';
import { useUserModel as useUserModel } from '../models/books-store.mjs';
import { Book } from '../models/books.mjs';
import dotenv from 'dotenv';

dotenv.config();
const assert = Chai.assert;
let bookStore;
let userStore;

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

describe('Model Book Test', function() {
  let testUser;
  before(async function() {
    testUser = await userStore.create('test3@gmail.com', '123456', 'testUser3')
  });

  context('check keylist', function() {
    before(async function() {
      await bookStore.create('title1', 'author1', new Date().toISOString(), 'abstract1', 'cover1', testUser.email);
      await bookStore.create('title2', 'author2', new Date().toISOString(), 'abstract2', 'cover2', testUser.email);
      await bookStore.create('title3', 'author3', new Date().toISOString(), 'abstract3', 'cover3', testUser.email);
    });
    
    it("should have three entities", async () => {
      const keys = await bookStore.keylist(testUser.email);
      assert.exists(keys);
      assert.isArray(keys);
      assert.lengthOf(keys, 3);
    });

    it("should have keys ", async () => {
      const keys = await bookStore.keylist(testUser.email);
      assert.exists(keys);
      assert.isArray(keys);
      assert.lengthOf(keys, 3);
      for (let key of keys) {
        assert.match(key, /[0-9]{1,3}/)
      }
    });

    after(async function() {
      const keyz = await bookStore.keylist(testUser.email);
      for (let key of keyz) {
        await bookStore.destroy(key);
      }
    });
  });

  context('read and create a book', function() {
    let bookTest1, bookTest2;
    before(async function() {
      bookTest1 = await bookStore.create('title1', 'author1', new Date().toISOString(), 'abstract1', 'cover1', testUser.email);
      bookTest2 = await bookStore.create('title2', 'author2', new Date().toISOString(), 'abstract2', 'cover2', testUser.email);
    });

    it('should have proper bookTest1', async function() {
      const book = await bookStore.read(bookTest1.id);
      assert.exists(book);
      assert.deepEqual(book, bookTest1);
    });

    it('should have proper bookTest2', async function() {
      const book = await bookStore.read(bookTest2.id);
      assert.exists(book);
      assert.deepEqual(book, bookTest2);
    });

    it('Unknown book should fail', async function() {
      try {
        const book = await bookStore.read('badkey12');
        assert.notExists(book);
      } catch(err) {
        assert.equal(err.message, 'Cannot read property \'id\' of null');
      }
    });

    after(async function() {
      const keyz = await bookStore.keylist(testUser.email);
      for (let key of keyz) {
        await bookStore.destroy(key);
      }
    });
  });

  context('delete a book', function() {
    let bookTest1;
    before(async function() {
      bookTest1 = await bookStore.create('title1', 'author1', new Date().toISOString(), 'abstract1', 'cover1', testUser.email);
    });

    it('should have proper bookTest1', async function() {
      const book = await bookStore.read(bookTest1.id);
      assert.exists(book);
      assert.deepEqual(book, bookTest1);
    });

    it('should delete and check if the book exists', async function() {
      let book = await bookStore.read(bookTest1.id);
      assert.exists(book);
      await bookStore.destroy(bookTest1.id);
      try {
        const book = await bookStore.read(bookTest1.id);
        assert.notExists(book);
      } catch(err) {
        assert.equal(err.message, `Cannot read property \'id\' of null`);
      }
    });

    after(async function() {
      const keyz = await bookStore.keylist(testUser.email);
      for (let key of keyz) {
        await bookStore.destroy(key);
      }
    });
  });

  context('update a book', function() {
    let bookTest1;
    before(async function() {
      bookTest1 = await bookStore.create('title1', 'author1', new Date().toISOString(), 'abstract1', 'cover1', testUser.email);
    });

    it('should have proper book', async function() {
      const book = await bookStore.read(bookTest1.id);
      assert.exists(book);
      assert.deepEqual(book, bookTest1);
    });

    it('should update and compare the new data', async function() {
      let book = await bookStore.read(bookTest1.id);
      assert.exists(book);
      await bookStore.update(book.id, book.title, 'authorUpdated', book.publication_date, book.abstract, book.cover);
      book = await bookStore.read(bookTest1.id);
      assert.notEqual(book, bookTest1);
      const bookUpdated = new Book(book.id, book.title, 'authorUpdated', book.publication_date, book.abstract, book.cover, book.userId);
      assert.deepEqual(book, bookUpdated);
    });

    after(async function() {
      const keyz = await bookStore.keylist(testUser.email);
      for (let key of keyz) {
        await bookStore.destroy(key);
      }
    });
  });

  after(async function() {
    await userStore.destroy(testUser.email);
  });
});