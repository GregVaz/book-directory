import { default as DBG } from 'debug';
const debug = DBG('books:books-store');
const error = DBG('books:error-store');

var _BooksStore;

export async function useModel() {
  try {
    let BooksStoreModule = await import(`./books-sequelize.mjs`);
    let BooksStoreClass = BooksStoreModule.default;
    _BooksStore = new BooksStoreClass();
    return _BooksStore;
  } catch (err) {
    throw new Error(`No recognized BooksStore in sequalize because
    ${err}`);
  }
}

export { _BooksStore as BooksStore };