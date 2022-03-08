const express = require("express");
const db = require("./app/models");
const app = express();
// parse requests of content-type - application/json
app.use(express.json());
// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

//Routes
require ('./app/routes/albumRoutes')(app)


//syncing DB
db.sequelize.sync({ force: true }).then(() => {
    console.log("Drop and re-sync db.");
  });
// set port, listen for requests
PORT = 8000;
app.listen(8000, () => {
  console.log(`Server is running on port ${PORT}.`);
});

// simple route
app.get("/", (req, res) => {
    res.json({ message: "Welcome to bezkoder application." });
  });