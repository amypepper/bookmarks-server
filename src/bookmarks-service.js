const db = require("./server");

const BookmarksService = {
  getAllBookmarks(db) {
    return db.select("*").from("bookmarks_table");
  },
  insertBookmark(db, newBookmark) {
    return db
      .insert(newBookmark)
      .into("bookmarks_table")
      .returning("*")
      .then((rows) => {
        return rows[0];
      });
  },
};

module.exports = BookmarksService;
