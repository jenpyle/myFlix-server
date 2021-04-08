const express = require('express'),
  morgan = require('morgan'),
  bodyParser = require('body-parser'),
  mongoose = require('mongoose'),
  Models = require('./models.js'),
  passport = require('passport');

const app = express();

require('./passport'); //Your local passport file

//Models.Movie, etc, refer to the model names defined in models.js
const Movies = Models.Movie; //can query the Movie model in  model.js
const Users = Models.User;

//Allows mongoose to connect to the database and perform CRUD operations on documents it contains with my REST API
mongoose.connect('mongodb://localhost:27017/myFlixDB', { useNewUrlParser: true, useUnifiedTopology: true });

let auth = require('./auth')(app); //The app arugment ensures your application can make use of your “auth.js” file, and that your “auth.js” file can use Express

let requestTime = (req, res, next) => {
  req.requestTime = Date.now();
  next();
};

app.use(bodyParser.json()); //!!MUST appear before any other endpoint middleware(app.get, app.post, etc.)
app.use(morgan('common'));
app.use(express.static('public'));
app.use(requestTime);
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

app.get('/', (req, res) => {
  let responseText = 'Welcome to my app!';
  responseText += '<small>Requested at: ' + req.requestTime + '</small>';
  res.send(responseText);
});

//Return a list of ALL movies to the user
app.get('/movies', passport.authenticate('jwt', { session: false }), (req, res) => {
  /* any request to the “movies” endpoint will require a JWT from the client. The JWT will be decoded and checked by the JWT authentication strategy you created earlier using Passport, which will authenticate the request. */
  Movies.find()
    .then((movies) => {
      if (!movies) {
        //check whether a document with the searched-for director even exists
        res.status(400).send('No movies found');
      } else {
        res.status(200).json(movies); ///////////////////////should this be 200 or 201? its 201 in the exercise example in 'Incorperating Authorization into your API Endpoints' section
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

//Return a list of users
app.get('/users', passport.authenticate('jwt', { session: false }), (req, res) => {
  Users.find()
    .then((users) => {
      if (!users) {
        //check whether a document with users even exists
        res.status(400).send('No users found');
      } else {
        res.json(users);
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

//Return data about a single movie by title to the user
app.get('/movies/:Title', passport.authenticate('jwt', { session: false }), (req, res) => {
  Movies.findOne({ Title: req.params.Title })
    .then((movie) => {
      if (!movie) {
        //check whether a document with the searched-for director even exists
        res.status(400).send('The movie ' + req.params.Title + ' was not found');
      } else {
        res.status(200).json(movie.Description);
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

//Return data about a genre (description) by name/title (e.g., “Thriller”)
app.get('/movies/genres/:Name', passport.authenticate('jwt', { session: false }), (req, res) => {
  Movies.findOne({ 'Genre.Name': req.params.Name })
    .then((movie) => {
      if (!movie) {
        //check whether a document with the searched-for director even exists
        res.status(400).send('Genre ' + req.params.Name + ' was not found');
      } else {
        res.status(200).json(movie.Genre.Description);
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

// Return data about a director (bio, birth year, death year) by name
app.get('/movies/directors/:Name', passport.authenticate('jwt', { session: false }), (req, res) => {
  Movies.findOne({ 'Director.Name': req.params.Name })
    .then((movie) => {
      if (!movie) {
        //check whether a document with the searched-for director even exists
        res.status(400).send('Director ' + req.params.Name + ' was not found');
      } else {
        res.json(movie.Director);
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

// Allow new users to register
app.post('/users', (req, res) => {
  Users.findOne({ Username: req.body.Username })
    .then((user) => {
      if (user) {
        return res.status(400).send(req.body.Username + ' already exists');
      } else {
        Users.create({
          //Mongoose command used on the User model to execute the database operation on MongoDB automatically. To insert a record into your “Users” collection
          Username: req.body.Username,
          Password: req.body.Password,
          Email: req.body.Email,
          Birthday: req.body.Birthday,
        }) // send a response back to the client that contains both a status code and the document (called “user”) you just created
          .then((user) => {
            res.status(201).json(user);
          }) // a callback takes the document you just added as a parameter. Here, this new document is given the name “user” but you could name it anything you want
          .catch((error) => {
            console.error(error);
            res.status(500).send('Error: ' + error);
          });
      }
    })
    .catch((error) => {
      //an important catch-all in case command runs into an error
      console.error(error);
      res.status(500).send('Error: ' + error);
    });
});

//Allow users to update their user info (username)
app.put('/users/:Username', passport.authenticate('jwt', { session: false }), (req, res) => {
  Users.findOneAndUpdate(
    { Username: req.params.Username },
    {
      //2nd callback param
      $set: {
        Username: req.body.Username,
        Password: req.body.Password,
        Email: req.body.Email,
        Birthday: req.body.Birthday,
      },
    },
    { new: true } // This line makes sure that the updated document is returned
  )
    .then((updatedUser) => {
      if (!updatedUser) {
        res.status(400).send('User ' + req.params.Username + ' was not found');
      } else {
        res.status(200).json(updatedUser); //document that was just updated (updatedUser) is sent to the client as a response
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

//Allow users to add a movie to their list of favorites
app.post('/users/:Username/movies/:MovieID', passport.authenticate('jwt', { session: false }), (req, res) => {
  Movies.findById(req.params.MovieID)
    .then(() =>
      Users.findOneAndUpdate(
        { Username: req.params.Username },
        {
          $addToSet: { FavoriteMovies: req.params.MovieID || '' },
        },
        { new: true }
      )
        .then((user) => {
          if (!user) {
            res.status(400).send('User ' + req.params.Username + ' was not found');
          } else {
            res
              .status(201)
              .send('Movie ID ' + req.params.MovieID + ' was added to favorite movies for user ' + req.params.Username);
          }
        })
        .catch((err) => {
          console.error(err);
          res.status(500).send('Error: ' + err);
        })
    )
    .catch(() => res.status(500).send(`Movie id ${req.params.MovieID} not found`));
});

//Allow users to remove a movie from their list of favorites
app.delete('/users/:Username/favoritemovies/:MovieID', passport.authenticate('jwt', { session: false }), (req, res) => {
  Users.findOneAndUpdate(
    { Username: req.params.Username }, //condition for which documents to update
    {
      $pull: { FavoriteMovies: req.params.MovieID }, //an object that includes which fields to update and what to update them to
    },
    { new: true }
  )
    //promise function after findOneAndRemove is completed
    .then((updatedUserFavs) => {
      if (!req.params.MovieID) {
        res.status(400).send('MovieID ' + req.params.MovieID + ' was not found');
      }
      if (!req.params.Username) {
        res.status(400).send('User ' + req.params.Username + ' was not found');
      } else {
        res.status(200).send('Movie ID ' + req.params.MovieID + ' was deleted from user ' + req.params.Username);
        res.json(updatedUserFavs);
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

//Allow existing users to deregister
app.delete('/users/:Username', passport.authenticate('jwt', { session: false }), (req, res) => {
  Users.findOneAndRemove({ Username: req.params.Username })
    .then((user) => {
      if (!user) {
        //check whether a document with the searched-for username even exists
        res.status(400).send(req.params.Username + ' was not found');
      } else {
        res.status(200).send('User ' + req.params.Username + ' was deleted.');
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

app.listen(8080, () => {
  console.log('Your app is listening on port 8080.');
});
