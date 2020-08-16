const BookmarksService = require("../src/bookmarks-service");
const knex = require("knex");
const { expect } = require("chai");

describe(`bookmarks service object`, function () {
  let db;
  let testBookmarks = [
    {
      id: "ckdmaggrq000204zc957qtp9c",
      title: "Google.fr",
      url: "https://www.google.fr",
      description: "Google in French",
      rating: 5,
    },
    {
      id: "ckdmagdewgh4zc957qtp9c",
      title: "Thinkful",
      url: "https://www.thinkful.com",
      description: "coding bootcamp",
      rating: 5,
    },
    {
      id: "ckdmaggrq000204zc957qetgc",
      title: "YouTube",
      url: "https://www.youtube.com",
      description: "a video streaming platform",
      rating: 5,
    },
  ];

  // create Knex instance
  before(() => {
    db = knex({
      client: "pg",
      connection: process.env.TEST_DB_URL,
    });
  });

  // clear data from table before running tests
  before(() => db("bookmarks_table").truncate());

  // clear data after each test
  afterEach(() => db("bookmarks_table").truncate());

  // disconnect from db after tests are done
  after(() => {
    return db.destroy();
  });

  // use context because we're setting a specific state for the app (in this case, having data)
  context(`given bookmarks_table has data`, () => {
    // insert data into table for testing before each test (so it's replaced after the after(.truncate))
    beforeEach(() => {
      return db.into("bookmarks_table").insert(testBookmarks);
    });

    it(`getAllBookmarks() resolves all bookmarks from 'bookmarks_table'`, () => {
      // test that BookmarksService.getAllbookmarks gets data from table
      return BookmarksService.getAllBookmarks(db).then((actual) => {
        expect(actual).to.eql(testBookmarks);
      });
    });

    it(`getById() resolves a bookmark by id from bookmarks_table`, () => {
      const thirdId = "ckdmaggrq000204zc957qetgc";
      const thirdTestBookmark = testBookmarks[2];

      return BookmarksService.getById(db, thirdId).then((actual) => {
        expect(actual).to.eql({
          id: thirdId,
          title: thirdTestBookmark.title,
          url: thirdTestBookmark.url,
          description: thirdTestBookmark.description,
          rating: thirdTestBookmark.rating,
        });
      });
    });

    it(`deleteBookmark() removes a bookmark by id from bookmarks_table`, () => {
      const bookmarkId = "ckdmaggrq000204zc957qtp9c";

      return BookmarksService.deleteBookmark(db, bookmarkId)
        .then(() => BookmarksService.getAllBookmarks(db))
        .then((allBookmarks) => {
          const expected = testBookmarks.filter(
            (bookmark) => bookmark.id !== bookmarkId
          );
          expect(allBookmarks).to.eql(expected);
        });
    });
  });

  context(`given bookmarks_table has no data`, () => {
    it(`getAllBookmarks() resolves an empty array`, () => {
      return BookmarksService.getAllBookmarks(db).then((actual) => {
        expect(actual).to.eql([]);
      });
    });
    it(`insertBookmarks() inserts a bookmark entry and resolves the bookmark`, () => {
      const newBookmark = {
        id: "ckddagdewgh4zc957qtp9s",
        title: "my site",
        url: "http://www.amylynnpepper.com",
        description: "best portfolio ever",
        rating: 5,
      };
      return BookmarksService.insertBookmark(db, newBookmark).then((actual) => {
        expect(actual).to.eql({
          id: newBookmark.id,
          title: newBookmark.title,
          url: newBookmark.url,
          description: newBookmark.description,
          rating: newBookmark.rating,
        });
      });
    });
  });
});
