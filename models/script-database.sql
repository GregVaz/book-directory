CREATE TABLE books (
  bookkey INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255),
  author VARCHAR(255),
  publication_date DATE,
  abstract TEXT,
  cover BLOB
)