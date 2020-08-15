const { expect } = require("chai");
const knex = require("knex");
const app = require("../src/app");

describe("bookmarks Endpoints", function () {
  let db;

  before("make knex instance", () => {
    db = knex({
      client: "pg",
      connection: process.env.TEST_DB_URL,
    });
    app.set("db", db);
  });

  after("disconnect from db", () => db.destroy());

  before("clean the table", () => db("bookmarks_table").truncate());

  context("Given there are bookmarks in the database", () => {
    const testBookmarks = [
      {
        description: "Google in French",
        id: "ckdmaggrq000204zc957qtp9c",
        rating: 5,
        title: "Google.fr",
        url: "https://www.google.fr",
      },
      {
        description: "coding bootcamp",
        id: "ckdmagdewgh4zc957qtp9c",
        rating: 5,
        title: "Thinkful",
        url: "https://www.thinkful.com",
      },
      {
        description: "a video streaming platform",
        id: "ckdmaggrq000204zc957qetgc",
        rating: 5,
        title: "YouTube",
        url: "https://www.youtube.com",
      },
    ];

    beforeEach("insert bookmarks", () => {
      return db.into("bookmarks_table").insert(testBookmarks);
    });
    it("GET /bookmarks responds with 200 and all of the bookmarks", () => {
      return supertest(app).get("/bookmarks").expect(200);
      // TODO: add more assertions about the body
    });
  });
});
