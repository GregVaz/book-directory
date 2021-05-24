let _BooksStore;
let _UserStore;

export async function useBookModel() {
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

export async function useUserModel() {
  try {
    let UsersStoreModule = await import(`./users-sequelize.mjs`);
    let UsersStoreClass = UsersStoreModule.default;
    _UserStore = new UsersStoreClass();
    return _UserStore;
  } catch (err) {
    throw new Error(`No recognized BooksStore in sequalize because
    ${err}`);
  }
}

export { _BooksStore as BooksStore, _UserStore as UserStore };
