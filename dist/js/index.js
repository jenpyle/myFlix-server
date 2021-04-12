const express = require('express'),
  morgan = require('morgan'),
  bodyParser = require('body-parser'),
  mongoose = require('mongoose'),
  Models = require('./models.js'),
  passport = require('passport'),
  cors = require('cors'),
  { check: check, validationResult: validationResult } = require('express-validator'),
  app = express();
require('./passport');
const Movies = Models.Movie,
  Users = Models.User;
mongoose.connect(process.env.CONNECTION_URI, { useNewUrlParser: !0, useUnifiedTopology: !0 });
let auth = require('./auth')(app),
  requestTime = (e, s, a) => {
    (e.requestTime = Date.now()), a();
  };
app.use(bodyParser.json()),
  app.use(morgan('common')),
  app.use(express.static('public')),
  app.use(requestTime),
  app.use(cors()),
  app.use((e, a, r, t) => {
    console.error(e.stack), r.status(500).send('Something broke!'), s;
  }),
  app.get('/', (e, s) => {
    let a = 'Welcome to my app!';
    (a += '<small>Requested at: ' + e.requestTime + '</small>'), s.status(200).send(a);
  }),
  app.get('/movies', passport.authenticate('jwt', { session: !1 }), (e, s) => {
    Movies.find()
      .then((e) => {
        e ? s.status(200).json(e) : s.status(200).send('No movies found');
      })
      .catch((e) => {
        console.error(e), s.status(500).send('Error: ' + e);
      });
  }),
  app.get('/users', passport.authenticate('jwt', { session: !1 }), (e, s) => {
    Users.find()
      .then((e) => {
        e ? s.status(200).json(e) : s.status(200).send('No users found');
      })
      .catch((e) => {
        console.error(e), s.status(500).send('Error: ' + e);
      });
  }),
  app.get('/movies/:Title', passport.authenticate('jwt', { session: !1 }), (e, s) => {
    Movies.findOne({ Title: e.params.Title })
      .then((a) => {
        a ? s.status(200).json(a.Description) : s.status(404).send('The movie ' + e.params.Title + ' was not found');
      })
      .catch((e) => {
        console.error(e), s.status(500).send('Error: ' + e);
      });
  }),
  app.get('/movies/genres/:Name', passport.authenticate('jwt', { session: !1 }), (e, s) => {
    Movies.findOne({ 'Genre.Name': e.params.Name })
      .then((a) => {
        a ? s.status(200).json(a.Genre.Description) : s.status(404).send('Genre ' + e.params.Name + ' was not found');
      })
      .catch((e) => {
        console.error(e), s.status(500).send('Error: ' + e);
      });
  }),
  app.get('/movies/directors/:Name', passport.authenticate('jwt', { session: !1 }), (e, s) => {
    Movies.findOne({ 'Director.Name': e.params.Name })
      .then((a) => {
        a ? s.status(200).json(a.Director) : s.status(404).send('Director ' + e.params.Name + ' was not found');
      })
      .catch((e) => {
        console.error(e), s.status(500).send('Error: ' + e);
      });
  }),
  app.post(
    '/users',
    [
      check('Username', 'Username must be at least 5 characters').isLength({ min: 5 }),
      check('Username', 'Username contains non alphanumeric characters - not allowed').isAlphanumeric(),
      check('Password', 'Password is required').not().isEmpty(),
      check('Email', 'Email does not appear to be valid').isEmail(),
    ],
    (e, s) => {
      let a = validationResult(e);
      if (!a.isEmpty()) return s.status(422).json({ errors: a.array() });
      let r = Users.hashPassword(e.body.Password);
      Users.findOne({ Username: e.body.Username })
        .then((a) => {
          if (a) return s.status(409).send(e.body.Username + ' already exists');
          Users.create({ Username: e.body.Username, Password: r, Email: e.body.Email, Birthday: e.body.Birthday })
            .then((e) => {
              s.status(201).json(e);
            })
            .catch((e) => {
              console.error(e), s.status(500).send('Error: ' + e);
            });
        })
        .catch((e) => {
          console.error(e), s.status(500).send('Error: ' + e);
        });
    }
  ),
  app.put(
    '/users/:Username',
    passport.authenticate('jwt', { session: !1 }),
    [
      check('Username', 'Username must be at least 5 characters').isLength({ min: 5 }),
      check('Username', 'Username contains non alphanumeric characters - not allowed').isAlphanumeric(),
      check('Password', 'Password is required').not().isEmpty(),
      check('Email', 'Email does not appear to be valid').isEmail(),
    ],
    (e, s) => {
      let a = validationResult(e);
      if (!a.isEmpty()) return s.status(422).json({ errors: a.array() });
      let r = Users.hashPassword(e.body.Password);
      Users.findOne({ Username: e.body.Username })
        .then((a) => {
          if (a) return s.status(409).send(e.body.Username + ' already exists');
          Users.findOneAndUpdate(
            { Username: e.params.Username },
            { $set: { Username: e.body.Username, Password: r, Email: e.body.Email, Birthday: e.body.Birthday } },
            { new: !0 }
          )
            .then((a) => {
              a ? s.status(200).json(a) : s.status(404).send('User ' + e.params.Username + ' was not found');
            })
            .catch((e) => {
              console.error(e), s.status(500).send('Error: ' + e);
            });
        })
        .catch((e) => {
          console.error(e), s.status(500).send('Error: ' + e);
        });
    }
  ),
  app.post('/users/:Username/movies/:MovieID', passport.authenticate('jwt', { session: !1 }), (e, s) => {
    Movies.findById(e.params.MovieID)
      .then(() =>
        Users.findOneAndUpdate(
          { Username: e.params.Username },
          { $addToSet: { FavoriteMovies: e.params.MovieID || '' } },
          { new: !0 }
        )
          .then((a) => {
            a
              ? s
                  .status(201)
                  .send('Movie ID ' + e.params.MovieID + ' was added to favorite movies for user ' + e.params.Username)
              : s.status(404).send('User ' + e.params.Username + ' was not found');
          })
          .catch((e) => {
            console.error(e), s.status(500).send('Error: ' + e);
          })
      )
      .catch(() => s.status(404).send(`Movie id ${e.params.MovieID} not found`));
  }),
  app.delete('/users/:Username/movies/:MovieID', passport.authenticate('jwt', { session: !1 }), (e, s) => {
    Movies.findById(e.params.MovieID)
      .then(() =>
        Users.findOneAndUpdate(
          { Username: e.params.Username },
          { $pull: { FavoriteMovies: e.params.MovieID || '' } },
          { new: !0 }
        )
          .then((a) => {
            a
              ? s.status(200).send('Movie ID ' + e.params.MovieID + ' was deleted from user ' + e.params.Username)
              : s.status(404).send('User ' + e.params.Username + ' was not found');
          })
          .catch((e) => {
            console.error(e), s.status(500).send('Error: ' + e);
          })
      )
      .catch(() => s.status(404).send(`Movie id ${e.params.MovieID} not found`));
  }),
  app.delete('/users/:Username', passport.authenticate('jwt', { session: !1 }), (e, s) => {
    Users.findOneAndRemove({ Username: e.params.Username })
      .then((a) => {
        a
          ? s.status(200).send('User ' + e.params.Username + ' was deleted.')
          : s.status(404).send(e.params.Username + ' was not found');
      })
      .catch((e) => {
        console.error(e), s.status(500).send('Error: ' + e);
      });
  });
const port = process.env.PORT || 8080;
app.listen(port, '0.0.0.0', () => {
  console.log('Listening on Port ' + port);
});
