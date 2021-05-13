const _book_bookkey = Symbol('bookkey');
const _book_title = Symbol('title');
const _book_author = Symbol('author');
const _book_publication_date = Symbol('publication_date');
const _book_abstract = Symbol('abstract');
const _book_cover = Symbol('cover');

// Describe a single Book that our application will manage
export class Book {
  constructor(bookkey, title, author, publication_date, abstract, cover) {
    this[_book_bookkey] = bookkey;
    this[_book_title] = title;
    this[_book_author] = author;
    this[_book_publication_date] = publication_date;
    this[_book_abstract] = abstract;
    this[_book_cover] = cover;
  }

  get bookkey() { return this[_book_bookkey]; }
  get title() { return this[_book_title]; }
  set title(newTitle) { this[_book_title] = newTitle; }
  get author() { return this[_book_author]; }
  set author(newAuthor) { this[_book_author] = newAuthor; }
  get publication_date() { return this[_book_publication_date]; }
  set publication_date(newPublicationDate) { this[_book_publication_date] = newPublicationDate; }
  get abstract() { return this[_book_abstract]; }
  set abstract(newAbstract) { this[_book_abstract] = newAbstract; }
  get cover() { return this[_book_cover]; }
  set cover(newCover) { this[_book_cover] = newCover; }

  get JSON() {
    return JSON.stringify({
      bookkey: this.bookkey,
      title: this.title,
      author: this.author,
      publication_date: this.publication_date,
      abstract: this.abstract,
      cover: this.cover,
    });
  }

  static fromJSON(json) {
    const data = JSON.parse(json);
    if (typeof data !== 'object'
      || !data.hasOwnProperty('bookkey')
      || typeof data.bookkey !== 'string'
      || !data.hasOwnProperty('title')
      || typeof data.title !== 'string'
      || !data.hasOwnProperty('author')
      || typeof data.author !== 'string'
      || !data.hasOwnProperty('publication_date')
      || typeof data.publication_date !== 'string'
      || !data.hasOwnProperty('newAbstract')
      || typeof data.newAbstract !== 'string'
      || !data.hasOwnProperty('cover')
      || typeof data.cover !== 'string') {
        throw new Error(`Not a Book: ${json}`);
    }
    const Book = new Book(
      data.bookkey,
      data.title,
      data.author,
      data.publication_date,
      data.abstract,
      data.cover
    );
    return Book;
  }
}

// Describes methods for managin some Book instances
export class AbstractBooksStore {
  async close() {  }
  async update(bookkey, title, author, publication_date, abstract, cover) {  }
  async create(bookkey, title, author, publication_date, abstract, cover) {  }
  async read(bookkey) {  }
  async destroy(bookkey) {  }
  async keylist() {  }
  async count() {  }
}
