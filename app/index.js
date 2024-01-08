const express = require("express");

const dotenv = require("dotenv");
dotenv.config();

const app = express();

app.use(express.json()); // middleware to pass the json
app.use(express.urlencoded({ extended: true })); // URL-encoded payloads standart

const PORT = process.env.PORT || 3000; // use 3001 if environment not set

// cors headers can be handled from here, if neccessary from clients.
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET", "POST", "PUT", "DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  next(); // nexxt middleware funtion
});

const { router: routes, database } = require("./routes");

// Use the main router for all routes
app.use(routes);

// Sync the database and start the server
database.sync().then(() => {
  const server = app.listen(PORT, () => {
    console.log(`Server http://localhost:${PORT} port'a Çalışıyor`);
  });

  // Event listener for handling server startup errors
  server.on("error", (error) => {
    console.error("Server Hatası:", error);
    process.exit(1);
  });
});
