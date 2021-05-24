import util from 'util';
import Chai from 'chai';
import { useUserModel as useUserModel } from '../models/books-store.mjs';
import dotenv from 'dotenv';

dotenv.config();
const assert = Chai.assert;
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

describe('Model User Test', () => {
  context('check keylist', () => {
    before(async () => {
      await userStore.create('test1@gmail.com', '123456', 'testUser1');
      await userStore.create('test2@gmail.com', '123456', 'testUser2');
    });
    
    it("should have two entities", async () => {
      const keys = await userStore.keylist();
      assert.exists(keys);
      assert.isArray(keys);
      assert.lengthOf(keys, 2);
    });

    it("should have keys test#@gmail.com", async () => {
      const keys = await userStore.keylist();
      assert.exists(keys);
      assert.isArray(keys);
      assert.lengthOf(keys, 2);
      for (let key of keys) {
        assert.match(key, /test[12]@gmail.com/)
      }
    });

    it("should have usernames testUser#", async function() {
      const keyz = await userStore.keylist();
      assert.exists(keyz);
      assert.isArray(keyz);
      assert.lengthOf(keyz, 2);
      var keyPromises = keyz.map(key => userStore.read(key));
      const users = await Promise.all(keyPromises);
      for (let user of users) {
      assert.match(user.username, /testUser[12]/, "correct username");
      }
      });

    after(async function() {
      const keyz = await userStore.keylist();
      for (let key of keyz) {
        await userStore.destroy(key);
      }
    });
  });

  context('read and create an user', function() {
    let testUser;
    before(async function() {
      testUser = await userStore.create('test1@gmail.com', '123456', 'testUser1');
    });

    it('should have proper user', async function() {
      const user = await userStore.read('test1@gmail.com');
      assert.exists(user);
      assert.deepEqual(user, testUser);
    });

    it('Unknown user should fail', async function() {
      try {
        const user = await userStore.verify('badkey12');
        assert.notExists(user);
        throw new Error('should not get here');
      } catch(err) {
        // An error is expected, so it is an error if
        // the 'should not get here' error is thrown
        assert.equal(err.message, 'should not get here');
      }
    });

    after(async function() {
      const keyz = await userStore.keylist();
      for (let key of keyz) {
        await userStore.destroy(key);
      }
    });
  });
});