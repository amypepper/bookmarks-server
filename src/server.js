const knex = require("knex");
const app = require("./app");
const { PORT, DB_URL } = require("./config");

// creating a Knex instance
const db = knex({
  client: "pg",
  connection: DB_URL,
});

// setting it as a property on the app instance
app.set("db", db);

app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`);
});
