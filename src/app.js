require("dotenv").config();
const express = require("express");
const winston = require("winston");
const cors = require("cors");
const helmet = require("helmet");
const { NODE_ENV } = require("./config");
const { v4: uuid } = require("uuid");
const BookmarksService = require("./bookmarks-service");
const jsonParser = express.json();
const app = express();

//////////////////  SAMPLE DATA //////////////////
const bookmarks = [
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

////////////////// LOGGER CONFIG //////////////////
const logger = winston.createLogger({
  level: "info",
  format: winston.format.json(),
  transports: [new winston.transports.File({ filename: "info.log" })],
});
// give more detailed notes if not in the production environment
if (NODE_ENV !== "production") {
  logger.add(
    new winston.transports.Console({
      format: winston.format.simple(),
    })
  );
}

///////////////////// MISC MIDDLEWARE /////////////////////
app.use(helmet());
app.use(cors());
app.use(express.json());

///////////////////// API KEY VALIDATION /////////////////////
app.use(function validateBearerToken(req, res, next) {
  const apiToken = process.env.API_TOKEN;
  const authToken = req.get("Authorization");

  if (!authToken || authToken.split(" ")[1] !== apiToken) {
    logger.error(`Unauthorized request to path: ${req.path}`);
    return res.status(401).json({ error: "Unauthorized request" });
  }
  // move to the next middleware
  next();
});

///////////////////// ROUTE HANDLERS /////////////////////
app.get("/", (req, res) => {
  res.send("Welcome!");
});

app.get("/bookmarks", (req, res, next) => {
  // `req.app.get('property-name) is how you access the property you
  // set using the .set() method from Express
  const knexInstance = req.app.get("db");

  BookmarksService.getAllBookmarks(knexInstance)
    .then((bookmarks) => {
      res.json(bookmarks);
    })
    // this will pass any errors to the error handling function below
    .catch(next);
});

// app.get("/bookmarks/:id", (req, res) => {
//   const { id } = req.params;
//   const bookmark = bookmarks.find((b) => b.id == id);

//   if (!bookmark) {
//     logger.error(`Bookmark with ID ${id} not found.`);
//     return res.status(404).send("Card not found");
//   }

//   res.json(bookmark);
// });

// app.post("/bookmarks", (req, res) => {
//   const { description, rating, title, url } = req.body;

//   if (!rating || rating > 5 || rating < 1) {
//     logger.error("A rating between 1 and 5 is required");
//     return res.status(400).send("Invalid data");
//   }
//   if (!title) {
//     logger.error("Title is required");
//     return res.status(400).send("Invalid data");
//   }
//   if (!url) {
//     logger.error("URL is required");
//     return res.status(400).send("Invalid data");
//   } else {
//     const id = uuid();

//     const newBookmark = {
//       description,
//       id,
//       rating,
//       title,
//       url,
//     };
//     bookmarks.push(newBookmark);

//     logger.info(`Card with id ${id} created`);
//     res
//       .status(201)
//       .location(`http://localhost:8000/bookmarks/${id}`)
//       .json(newBookmark);
//   }
// });

// app.post("/bookmarks", jsonParser, (req, res, next) => {
//   const { description, rating, title, url } = req.body;
//   const newBookmark = {
//     description,
//     id,
//     rating,
//     title,
//     url,
//   };
//   BookmarksService.insertBookmark(req.app.get("db"), newBookmark)
//     .then((article) => {
//       res.status(201).json(article);
//     })
//     .catch(next);
// });

// app.delete("/bookmarks/:id", (req, res) => {
//   const { id } = req.params;
//   const index = bookmarks.findIndex((b) => b.id === id);

//   if (index === -1) {
//     return res.status(404).send("Bookmark not found");
//   }

//   bookmarks.splice(index, 1);
//   logger.info(`Bookmark with id ${id} deleted`);
//   res.status(204).end();
// });

///////////////////// ERROR HANDLER /////////////////////
// last middleware in pipeline
app.use(function errorHandler(error, req, res, next) {
  let response;
  if (NODE_ENV === "production") {
    response = { error: { message: "server error" } };
  } else {
    console.error(error);
    response = { message: error.message, error };
  }
  res.status(500).json(response);
});

module.exports = app;
