import { Book, AbstractBooksStore } from './Books.mjs';
import Sequelize from 'sequelize';
import {
  connectDB as connectSequlz,
  close as closeSequlz
} from './sequlz.mjs';
import DBG from 'debug';
const debug = DBG('books:books-sequelize');
const dberror = DBG('books:error-sequelize');

var sequelize;
export class SQBook extends Sequelize.Model {}

async function connectDB() {
  if (sequelize) return;
  sequelize = await connectSequlz();
  SQBook.init({
    bookkey: { type: Sequelize.DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    title: Sequelize.DataTypes.STRING,
    author: Sequelize.DataTypes.STRING,
    publication_date: Sequelize.DataTypes.DATE,
    abstract: Sequelize.DataTypes.TEXT,
    cover: Sequelize.DataTypes.BLOB
  }, {
    sequelize,
    modelName: 'books',
    timestamps: false
  });
  await SQBook.sync();
}

export default class SequelizeBooksStore extends AbstractBooksStore {

  async close() {
    closeSequlz();
    sequelize = undefined;
  }

  async update(bookkey, title, author, publication_date, abstract, cover) {
    await connectDB();
    const Book = await SQBook.findOne({ where: { bookkey: bookkey } }) 
    if (!Book) { 
        throw new Error(`No Book found for ${bookkey}`); 
    } else {
        await SQBook.update({ 
            title: title, 
            author: author,
            publication_date: publication_date,
            abstract: abstract,
            cover: cover
        }, {
            where: { bookkey: bookkey }
        });
        return this.read(bookkey);
    } 
  }

  async create(title, author, publication_date, abstract, cover) {
    await connectDB();
    const sqbook = await SQBook.create({ 
        title: title, 
        author: author,
        publication_date: publication_date,
        abstract: abstract,
        cover: cover
    });
    return new Book(sqbook.bookkey, sqbook.title, sqbook.author, sqbook.publication_date, sqbook.abstract, sqbook.cover);
  }

  async read(bookkey) {
    await connectDB();
    const sqbook = await SQBook.findOne({ where: { bookkey: bookkey } });
    if (!Book) { 
        throw new Error(`No Book found for ${bookkey}`); 
    } else { 
        return new Book(sqbook.bookkey, sqbook.title, sqbook.author, sqbook.publication_date, sqbook.abstract, sqbook.cover); 
    } 
  }

  async destroy(bookkey) {
    await connectDB();
    await SQBook.destroy({ where: { bookkey: bookkey } });
    debug(`DESTROY ${bookkey}`);
  }

  async keylist() {
    await connectDB();
    const books = await SQBook.findAll({ attributes: [ 'bookkey' ] });
    const bookkeys = books.map(Book => Book.bookkey); 
    debug(`KEYLIST ${bookkeys}`);
    return bookkeys;
  }

  async count() {
    await connectDB();
    const count = await SQBook.count();
    debug(`COUNT ${count}`); 
    return count; 
  }
}