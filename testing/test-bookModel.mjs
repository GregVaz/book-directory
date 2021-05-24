import util from 'util';
import Chai from 'chai';
import { useBookModel as useBookModel } from '../models/books-store.mjs';
import { useUserModel as useUserModel } from '../models/books-store.mjs';
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

  after(async function() {
    await userStore.destroy(testUser.email);
  });
});