/* const app = require("../src/app");
const { expect } = require("chai");
const knex = require("knex");

describe("App", () => {
  let db;

  before("make knex instance", () => {
    db = knex({
      client: "pg",
      connection: process.env.TEST_DB_URL,
    });
  });

  after("disconnect from db", () => db.destroy());

  before("clean the table", () => db("bookmarks_table").truncate());

  it('GET / responds with 200 containing "Hello, world!"', () => {
    return supertest(app).get("/").expect(200, "Welcome!");
  });
  // it("GET /bookmarks responds with 200 containing all bookmarks in db", () => {
  //   return supertest(app).get("/bookmarks").expect(200, "Welcome!");
  // });
}); */
