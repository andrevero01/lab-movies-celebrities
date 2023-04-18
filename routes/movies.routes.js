// starter code in both routes/celebrities.routes.js and routes/movies.routes.js
const router = require("express").Router();
const Movie = require("../models/Movie.model");
const Celebrity = require("../models/Celebrity.model");
// all your routes here
//Form to create movie
router.get("/movies/create", (req, res, next) => {
  Celebrity.find()
    .then((dbCelebrities) => {
      res.render("movies/new-movie", { dbCelebrities });
    })
    .catch((err) => {
      const errorMessage = `Error creating movie: ${err.message}`;
      res.render("new-movie", { errorMessage });
    });
});

//Create a new movie
router.post("/movies/create", (req, res, next) => {
  const { title, genre, plot, cast } = req.body;
  Movie.create({ title, genre, plot, cast })
    .then((newMovie) => res.redirect("/all-movies"))
    .catch((err) => {
      const errorMessage = `Error creating movie: ${err.message}`;
      res.render("new-movie", { errorMessage });
    });
});

//Display all movies
router.get("/all-movies", (req, res, next) => {
  Movie.find()
    .then((dbMovies) => {
      res.render("movies/all-movies", { movies: dbMovies });
    })
    .catch((err) => {
      console.log(`Err while creating movie in the DB: ${err}`);
      next(err);
    });
});

//Movie details
router.get("/movies/:id", (req, res, next) => {
  Movie.findById(req.params.id)
    .populate("cast")
    .then((dbMovie) => {
      res.render("movies/movie-details", { movie: dbMovie });
    })
    .catch((err) => {
      console.log(`Err while retreiving movie from the DB: ${err}`);
      next(err);
    });
});

//Delete movie
router.post("/movies/:id/delete", (req, res, next) => {
  Movie.findByIdAndDelete(req.params.id)
    .then(() => res.redirect("/all-movies"))
    .catch((err) => {
      console.log(`Err while deleting movie from the DB: ${err}`);
      next(err);
    });
});

//Form to update movie
router.get("/movies/:id/edit", (req, res, next) => {
  Movie.findById(req.params.id)
    .populate("cast")
    .then((movie) => {
      Celebrity.find()
        .then((celebrities) => {
          res.render("movies/edit-movie", { movie, celebrities });
        })
        .catch((err) => {
          console.log(`Error retrieving celebrities from the DB: ${err}`);
        });
    })
    .catch((err) => {
      console.log(`Error retrieving movie from the DB: ${err}`);
    });
});

//Update movie
router.post("/movies/:id", (req, res, next) => {
  const movieId = req.params.id;
  const { title, genre, plot, cast } = req.body;
  Movie.findByIdAndUpdate(movieId, req.body)
    .then(() => {
      return Movie.findById(movieId).populate("cast");
    })
    .then((updatedMovie) => {
      res.render("movies/movie-details", { movie: updatedMovie });
    })
    .catch((err) => {
      console.log(`Error editing movie in the DB: ${err}`);
    });
});

module.exports = router;
