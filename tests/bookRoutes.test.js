process.env.NODE_ENV = "test";

const request = require("supertest");

const app = require("../app");
const db = require("../db");
const Book = require('../models/book');


describe("Book Routes Test", function () {
  beforeEach(async function () {
    await db.query("DELETE FROM books");

    await Book.create(  {
      "isbn": "9780316769488",
      "amazon_url": "https://www.amazon.com/dp/0316769487",
      "author": "J.D. Salinger",
      "language": "English",
      "pages": 224,
      "publisher": "Little, Brown and Company",
      "title": "The Catcher in the Rye",
      "year": 1951
    });
  });

  /** GET /books - returns `{books: [book, ...]}` */
  describe("GET /books", function () {
    test("can get list of books", async function () {
      const resp = await request(app).get(`/books`);

      expect(resp.body).toEqual({
        books: [  {
          "isbn": "9780316769488",
          "amazon_url": "https://www.amazon.com/dp/0316769487",
          "author": "J.D. Salinger",
          "language": "English",
          "pages": 224,
          "publisher": "Little, Brown and Company",
          "title": "The Catcher in the Rye",
          "year": 1951
        }]
      });
    });
  });

  /** GET /books/[isbn] - return data about one book: `{book: book}` */
  describe("GET /books/:isbn", function () {
    test("can get book", async function () {
      const resp = await request(app).get(`/books/9780316769488`);

      expect(resp.body).toEqual({
        book:   {
          "isbn": "9780316769488",
          "amazon_url": "https://www.amazon.com/dp/0316769487",
          "author": "J.D. Salinger",
          "language": "English",
          "pages": 224,
          "publisher": "Little, Brown and Company",
          "title": "The Catcher in the Rye",
          "year": 1951
        }
      });
    });

    test("returns 404 if book not found", async function () {
      const resp = await request(app).get(`/books/999`);

      expect(resp.status).toEqual(404);
    });
  });

  /** POST /books - create book from data; return `{book: book}` */
  describe("POST /books", function () {
    test("can create book", async function () {
      const resp = await request(app)
        .post(`/books`)
        .send({
          "isbn": "9780140449266",
          "amazon_url": "https://www.amazon.com/dp/0140449264",
          "author": "Leo Tolstoy",
          "language": "English",
          "pages": 1392,
          "publisher": "Penguin Classics",
          "title": "War and Peace",
          "year": 1869
        });

      expect(resp.body).toEqual({
        book: {
          "isbn": "9780140449266",
          "amazon_url": "https://www.amazon.com/dp/0140449264",
          "author": "Leo Tolstoy",
          "language": "English",
          "pages": 1392,
          "publisher": "Penguin Classics",
          "title": "War and Peace",
          "year": 1869
        }
      });
    });

    test("returns 400 if data is invalid", async function () {
      const resp = await request(app)
        .post(`/books`)
        .send({
          "isbn": "9780140449266",
          "amazon_url": "https://www.amazon.com/dp/0140449264",
          "author": "Leo Tolstoy",
          "language": "English",
          "pages": "something broke",
          "publisher": "Penguin Classics",
          "title": "War and Peace",
          "year": 1869
        });

      expect(resp.status).toEqual(400);
    });
  });

  /** PUT /books/[isbn] - update book; return `{book: book}` */
  describe("PUT /books/:isbn", function () {
    test("can update book", async function () {
      const resp = await request(app)
        .put(`/books/9780316769488`)
        .send(  {
          "amazon_url": "https://www.amazon.com/dp/0316769487",
          "author": "J.D. Salinger",
          "language": "English",
          "pages": 230,
          "publisher": "Little, Brown and Company",
          "title": "The Catcher in the Rye",
          "year": 1951
        });

      expect(resp.body).toEqual({
        book: {
          "isbn": "9780316769488",
          "amazon_url": "https://www.amazon.com/dp/0316769487",
          "author": "J.D. Salinger",
          "language": "English",
          "pages": 230,
          "publisher": "Little, Brown and Company",
          "title": "The Catcher in the Rye",
          "year": 1951
        }
      });
    });

    test("returns 404 if book not found", async function () {
      const resp = await request(app)
        .put(`/books/999`)
        .send({
          "isbn": "999",
          "amazon_url": "https://www.amazon.com/dp/999",
          "author": "George Orwell",
          "language": "English",
          "pages": 400,
          "publisher": "Signet Classics",
          "title": "1984",
          "year": 1949
        });

      expect(resp.status).toEqual(404);
    });

    test("returns 400 if data is invalid", async function () {
      const resp = await request(app)
        .put(`/books/9780316769488`)
        .send({
          "isbn": "9780451524935",
          "amazon_url": "https://www.amazon.com/dp/0316769487",
          "author": "J.D. Salinger",
          "language": "English",
          "pages": " the brokw",
          "publisher": "Little, Brown and Company",
          "title": "The Catcher in the Rye",
          "year": 1951
        });

      expect(resp.status).toEqual(400);
    });
  });

  /** DELETE /books/[isbn] - delete book,
   *  return `{message: "Book deleted"}` */
  describe("DELETE /books/:isbn", function () {
    test("can delete book", async function () {
      const resp = await request(app)
        .delete(`/books/9780316769488`);

      expect(resp.body).toEqual({ message: "Book deleted" });
    });
  });

  afterAll(async function () {
    await db.end();
  });
});