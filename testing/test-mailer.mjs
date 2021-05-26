import util from 'util';
import Chai from 'chai';
import dotenv from 'dotenv';
import { Book } from '../models/books.mjs';
import { default as sendEmail } from '../mail/mailer.mjs';

dotenv.config();
const assert = Chai.assert;

describe('Mailer', function() {

  context('Send a mailer', function() {
    it('Recieve a success response for the mailer', async () => {
      const book = new Book(1, 'title1', 'author1', new Date().toISOString(), 'abstract1', 'cover1', process.env.EMAIL_TEST);
      const mail = await sendEmail(true, book);
      assert.exists(mail);
      assert.isArray(mail.accepted);
      assert.lengthOf(mail.accepted, 1);
      assert.include(mail.response, 'OK')
    });
  });

});