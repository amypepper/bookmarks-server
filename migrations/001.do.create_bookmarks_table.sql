DROP TABLE IF EXISTS bookmarks_table;

CREATE TABLE bookmarks_table (
    id TEXT NOT NULL,
    title TEXT NOT NULL,
    url TEXT NOT NULL,
    description TEXT,
    rating INTEGER NOT NULL
);