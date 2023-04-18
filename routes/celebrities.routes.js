// starter code in both routes/celebrities.routes.js and routes/movies.routes.js
const router = require("express").Router();
const Celebrity = require("../models/Celebrity.model");
// all your routes here
//Form to create celebrity
router.get("/celebrities/create", (req, res, next) => {
  res.render("celebrities/new-celebrity");
});

//Create a new celebrity
router.post("/celebrities/create", (req, res, next) => {
  const { name, occupation, catchPhrase } = req.body;
  Celebrity.create({ name, occupation, catchPhrase })
    .then((newCelebrity) => res.redirect("/all-celebrities"))
    .catch((err) => {
      const errorMessage = `Error creating celebrity: ${err.message}`;
      res.render("new-celebrity", { errorMessage });
    });
});

//Display all celebrities
router.get("/all-celebrities", (req, res, next) => {
  Celebrity.find()
    .then((dbCelebrities) => {
      res.render("celebrities/all-celebrities", { celebrities: dbCelebrities });
    })
    .catch((err) => {
      console.log(`Err while retreiving celebrity from the DB: ${err}`);
      next(err);
    });
});

module.exports = router;
