const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("./database.db", (err) => {
  if (err) {
    console.error("Database ulanishida muammo bor");
  } else {
    console.error("Database ulandi: database.db");
  }
});
module.exports = db;
