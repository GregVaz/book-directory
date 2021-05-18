import { Book, AbstractBooksStore } from './books.mjs';
import { SQUser } from './users-sequelize.mjs';
import Sequelize from 'sequelize';
import {
  connectDB as connectSequlz,
  close as closeSequlz
} from './index.mjs';
import DBG from 'debug';
const debug = DBG('books:books-sequelize');
const dberror = DBG('books:error-sequelize');

var sequelize;
export class SQBook extends Sequelize.Model {}

async function connectDB() {
  if (sequelize) return;
  sequelize = await connectSequlz();
  SQBook.init({
    id: { type: Sequelize.DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    title: Sequelize.DataTypes.STRING,
    author: Sequelize.DataTypes.STRING,
    publication_date: Sequelize.DataTypes.DATE,
    abstract: Sequelize.DataTypes.TEXT,
    cover: Sequelize.DataTypes.BLOB,
    userId: Sequelize.DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Books',
    timestamps: false
  });
  // SQBook.belongsTo(SQUser);
  await SQBook.sync();
}

export default class SequelizeBooksStore extends AbstractBooksStore {

  async close() {
    closeSequlz();
    sequelize = undefined;
  }

  async update(id, title, author, publication_date, abstract, cover) {
    await connectDB();
    const Book = await SQBook.findOne({ where: { id: id } }) 
    if (!Book) { 
        throw new Error(`No Book found for ${id}`); 
    } else {
        await SQBook.update({ 
            title: title, 
            author: author,
            publication_date: publication_date,
            abstract: abstract,
            cover: cover
        }, {
            where: { id: id }
        });
        return this.read(id);
    } 
  }

  async create(title, author, publication_date, abstract, cover, userId) {
    await connectDB();
    const sqbook = await SQBook.create({ 
        title: title, 
        author: author,
        publication_date: publication_date,
        abstract: abstract,
        cover: cover,
        userId: userId
    });
    return new Book(sqbook.id, sqbook.title, sqbook.author, sqbook.publication_date, sqbook.abstract, sqbook.cover, sqbook.userId);
  }

  async read(id) {
    await connectDB();
    const sqbook = await SQBook.findOne({ where: { id: id } });
    if (!Book) { 
        throw new Error(`No Book found for ${id}`); 
    } else { 
        return new Book(sqbook.id, sqbook.title, sqbook.author, sqbook.publication_date, sqbook.abstract, sqbook.cover, sqbook.userId); 
    } 
  }

  async destroy(id) {
    await connectDB();
    await SQBook.destroy({ where: { id: id } });
    debug(`DESTROY ${id}`);
  }

  async keylist(userId) {
    await connectDB();
    const books = await SQBook.findAll({ where: { userId: userId } });
    const ids = books.map(Book => Book.id); 
    debug(`KEYLIST ${ids}`);
    return ids;
  }

  async count() {
    await connectDB();
    const count = await SQBook.count();
    debug(`COUNT ${count}`); 
    return count; 
  }
}