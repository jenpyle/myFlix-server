/**
 * @file RESTful API, which uses Express to route requests and responses
 */

const express = require('express'),
	morgan = require('morgan'),
	bodyParser = require('body-parser'),
	mongoose = require('mongoose'),
	Models = require('./models.js'),
	passport = require('passport'),
	cors = require('cors'),
	{ check, validationResult } = require('express-validator');

const app = express();

//Your local passport file
require('./passport');

/**
 * Constants Movie and User refer to the model names defined in models.js
 */
const Movies = Models.Movie; //can query the Movie model in  model.js
const Users = Models.User;

/**
 * Allows mongoose to connect to the database and perform
 * CRUD operations on documents it contains with the REST API
 */
mongoose.connect(process.env.CONNECTION_URI, { useNewUrlParser: true, useUnifiedTopology: true });
// mongoose.connect('mongodb://localhost:27017/myFlixDB', { useNewUrlParser: true, useUnifiedTopology: true });

let requestTime = (req, res, next) => {
	req.requestTime = Date.now();
	next();
};

app.use(bodyParser.json()); //!!MUST appear before any other endpoint middleware(app.get, app.post, etc.)
app.use(morgan('common'));
app.use(express.static('public'));
app.use(requestTime);
app.use(cors());
app.use((err, req, res, next) => {
	console.error(err.stack);
	res.status(500).send('Something broke! :`(');
	s;
});

//The app arugment ensures your application can make use of your “auth.js” file, and that your “auth.js” file can use Express
let auth = require('./auth')(app);

/**
 * Methods for the API requests, endpoints, and validation
 * Requests to these API endpoints will require a JWT from the client.
 * The JWT will be decoded and checked by the JWT authentication strategy,
 * which will authenticate the request
 */

app.get('/', (req, res) => {
	let responseText = 'Welcome to my app!';
	responseText += '<small>Requested at: ' + req.requestTime + '</small>';
	res.status(200).send(responseText);
});

/**
 * GET a list of all movies
 */
app.get('/movies', passport.authenticate('jwt', { session: false }), (req, res) => {
	Movies.find()
		.then((movies) => {
			if (!movies) {
				//check whether a document with the searched-for director even exists
				res.status(200).send('No movies found');
			} else {
				res.status(200).json(movies);
			}
		})
		.catch((err) => {
			console.error(err);
			res.status(500).send('Error: ' + err);
		});
});

/**
 * GET a list of users
 */
app.get('/users', passport.authenticate('jwt', { session: false }), (req, res) => {
	Users.find()
		.then((users) => {
			if (!users) {
				//check whether a document with users even exists
				res.status(200).send('No users found');
			} else {
				res.status(200).json(users);
			}
		})
		.catch((err) => {
			console.error(err);
			res.status(500).send('Error: ' + err);
		});
});

/**
 * GET data about the current user
 * @param {Username}
 */
app.get('/users/:Username', passport.authenticate('jwt', { session: false }), (req, res) => {
	Users.findOne({ Username: req.params.Username })
		.then((user) => {
			if (!user) {
				//check whether a document with the searched-for user even exists
				res.status(404).send('The  user ' + req.params.Username + ' was not found');
			} else {
				res.status(200).json(user);
			}
		})
		.catch((err) => {
			console.error(err);
			res.status(500).send('Error: ' + err);
		});
});

/**
 * GET data about a single movie by title
 * @param {Title}
 */
app.get('/movies/:Title', passport.authenticate('jwt', { session: false }), (req, res) => {
	Movies.findOne({ Title: req.params.Title })
		.then((movie) => {
			if (!movie) {
				//check whether a document with the searched-for director even exists
				res.status(404).send('The movie ' + req.params.Title + ' was not found');
			} else {
				res.status(200).json(movie.Description);
			}
		})
		.catch((err) => {
			console.error(err);
			res.status(500).send('Error: ' + err);
		});
});

/**
 * GET data about a genre (description) by name/title (e.g., “Thriller”)
 * @param {Name}
 */
app.get('/movies/genres/:Name', passport.authenticate('jwt', { session: false }), (req, res) => {
	Movies.findOne({ 'Genre.Name': req.params.Name })
		.then((movie) => {
			if (!movie) {
				//check whether a document with the searched-for director even exists
				res.status(404).send('Genre ' + req.params.Name + ' was not found');
			} else {
				res.status(200).json(movie.Genre.Description);
			}
		})
		.catch((err) => {
			console.error(err);
			res.status(500).send('Error: ' + err);
		});
});

/**
 * GET data about a director by name
 * @param {Name}
 */
app.get('/movies/directors/:Name', passport.authenticate('jwt', { session: false }), (req, res) => {
	Movies.findOne({ 'Director.Name': req.params.Name })
		.then((movie) => {
			if (!movie) {
				//check whether a document with the searched-for director even exists
				res.status(404).send('Director ' + req.params.Name + ' was not found');
			} else {
				res.status(200).json(movie.Director);
			}
		})
		.catch((err) => {
			console.error(err);
			res.status(500).send('Error: ' + err);
		});
});

/**
 * POST new user information, for user registration
 */
app.post('/users', [check('Username', 'Username must be at least 5 characters').isLength({ min: 5 }), check('Username', 'Username contains non alphanumeric characters - not allowed').isAlphanumeric(), check('Password', 'Password is required').not().isEmpty(), check('Email', 'Email does not appear to be valid').isEmail()], (req, res) => {
	//check the validation object for errors
	let errors = validationResult(req);

	/**
	 * If an error occurs, the rest of the code will not execute, keeping your database safe from any potentially malicious code.
	 */
	if (!errors.isEmpty()) {
		return res.status(422).json({
			errors: errors.array(),
		});
	}

	/**
	 * Hash any password entered by the user when registering before storing it in the MongoDB database
	 */
	let hashedPassword = Users.hashPassword(req.body.Password);
	/**
	 * Search to see if a user with the requested username already exists
	 */
	Users.findOne({ Username: req.body.Username }).then((user) => {
		if (user) {
			return res.status(409).send(req.body.Username + ' already exists');
		} else {
			/**
			 * Mongoose create command used on the User model to execute the database operation
			 * on MongoDB automatically. To insert a record into the “Users” collection
			 */
			Users.create({
				//
				Username: req.body.Username,
				Password: hashedPassword,
				Email: req.body.Email,
				Birthday: req.body.Birthday,
			})
				// send a response back to the client that contains both a status code and the document (called “user”) you just created
				.then((user) => {
					res.status(201).json(user);
				})
				.catch((error) => {
					console.error(error);
					res.status(500).send('Error: ' + error);
				});
		}
	});
	//an important catch-all in case command runs into an error
	// .catch((error) => {
	// 	console.error(error);
	// 	res.status(500).send('Error: ' + error);
	// });
});

/**
 * PUT user information
 * Allows users to update their user info (WITHOUT password)
 * @param {Username}
 */
app.put('/users/:Username', passport.authenticate('jwt', { session: false }), [check('Username', 'Username must be at least 5 characters').isLength({ min: 5 }), check('Username', 'Username contains non alphanumeric characters - not allowed').isAlphanumeric(), check('Email', 'Email does not appear to be valid').isEmail()], (req, res) => {
	//check the validation object for errors
	let errors = validationResult(req);
	//If an error occurs, the rest of the code will not execute
	if (!errors.isEmpty()) {
		return res.status(422).json({
			errors: errors.array(),
		});
	}

	/**
	 * Search to see if a user with the requested username already exists
	 */
	Users.findOne({ Username: req.body.Username })
		.then((user) => {
			/**
			 * checks if the user's username is being changed
			 * and if so, it also checks if that username is
			 * already being used
			 */
			if (req.params.Username !== req.body.Username && user !== null) {
				return res.status(409).send(req.body.Username + ' already exists');
			} else {
				Users.findOneAndUpdate(
					{ Username: req.params.Username },
					{
						//2nd callback param
						$set: {
							Username: req.body.Username,
							Email: req.body.Email,
							Birthday: req.body.Birthday,
						},
					},
					{ new: true } // This line makes sure that the updated document is returned
				)
					.then((updatedUser) => {
						if (!updatedUser) {
							res.status(400).send('User ' + req.params.Username + ' could not be updated');
						} else {
							//document that was just updated (updatedUser) is sent to the client as a response
							res.status(200).json(updatedUser);
						}
					})
					.catch((err) => {
						console.error(err);
						res.status(500).send('Error: ' + err);
					});
			}
		})
		.catch((error) => {
			//catch-all in case command runs into an error
			console.error(error);
			res.status(500).send('Error: ' + error);
		});
});

/**
 * PUT user information, including password
 * Allows users to update their user info with a new password
 * @param {Username}
 */
app.put('/users/:Username/password', passport.authenticate('jwt', { session: false }), [check('Username', 'Username must be at least 5 characters').isLength({ min: 5 }), check('Username', 'Username contains non alphanumeric characters - not allowed').isAlphanumeric(), check('Password', 'Password is required').not().isEmpty(), check('Email', 'Email does not appear to be valid').isEmail()], (req, res) => {
	//check the validation object for errors
	let errors = validationResult(req);

	if (!errors.isEmpty()) {
		return res.status(422).json({
			errors: errors.array(),
		});
	}
	let hashedPassword = Users.hashPassword(req.body.Password);
	// Search to see if a user with the requested username already exists
	Users.findOne({ Username: req.body.Username })
		.then((user) => {
			if (req.params.Username !== req.body.Username && user !== null) {
				return res.status(409).send(req.body.Username + ' already exists');
			} else {
				Users.findOneAndUpdate(
					{ Username: req.params.Username },
					{
						//2nd callback param
						$set: {
							Username: req.body.Username,
							Password: hashedPassword,
							Email: req.body.Email,
							Birthday: req.body.Birthday,
						},
					},
					{ new: true } // This line makes sure that the updated document is returned
				)
					.then((updatedUser) => {
						if (!updatedUser) {
							res.status(400).send('User ' + req.params.Username + ' could not be updated');
						} else {
							//document that was just updated (updatedUser) is sent to the client as a response
							res.status(200).json(updatedUser);
						}
					})
					.catch((err) => {
						console.error(err);
						res.status(500).send('Error: ' + err);
					});
			}
		})
		.catch((error) => {
			//catch-all in case command runs into an error
			console.error(error);
			res.status(500).send('Error: ' + error);
		});
});

/**
 * POST a favorite movie
 * Allow users to add a movie to their list of favorites
 * @param {Username}
 * @param {MovieID}
 */
app.post('/users/:Username/movies/favoritemovies/:MovieID', passport.authenticate('jwt', { session: false }), (req, res) => {
	Movies.findById(req.params.MovieID)
		.then(() =>
			Users.findOneAndUpdate(
				//condition for which documents to update
				{ Username: req.params.Username },
				{
					//an object that includes which fields to update and what to update them to
					$addToSet: { FavoriteMovies: req.params.MovieID || '' },
				},
				{ new: true }
			) //promise function after findOneAndUpdate is completed
				.then((user) => {
					if (!user) {
						res.status(404).send('User ' + req.params.Username + ' was not found');
					} else {
						console.log('Movie ID ' + req.params.MovieID + ' was added to favorite movies for user ' + req.params.Username);
						res.status(201).send(user);
					}
				})
				.catch((err) => {
					console.error(err);
					res.status(500).send('Error: ' + err);
				})
		)
		.catch(() => res.status(404).send(`Movie id ${req.params.MovieID} not found`));
});

/**
 * POST a movie To Watch List
 * Allow users to add a movie to their To Watch list
 * @param {Username}
 * @param {MovieID}
 */
app.post('/users/:Username/movies/towatch/:MovieID', passport.authenticate('jwt', { session: false }), (req, res) => {
	Movies.findById(req.params.MovieID)
		.then(() =>
			Users.findOneAndUpdate(
				//condition for which documents to update
				{ Username: req.params.Username },
				//an object that includes which fields to update and what to update them to
				{
					$addToSet: { ToWatch: req.params.MovieID || '' },
				},
				{ new: true }
			) //promise function after findOneAndUpdate is completed
				.then((user) => {
					if (!user) {
						res.status(404).send('User ' + req.params.Username + ' was not found');
					} else {
						console.log('Movie ID ' + req.params.MovieID + ' was added to ' + req.params.Username + '\'s "To Watch" list');
						res.status(201).send(user);
					}
				})
				.catch((err) => {
					console.error(err);
					res.status(500).send('Error: ' + err);
				})
		)
		.catch(() => res.status(404).send(`Movie id ${req.params.MovieID} not found`));
});

/**
 * DELETE a movie from Favorite Movies
 * Allow users to remove a movie from their list of favorites
 * @param {Username}
 * @param {MovieID}
 */
app.delete('/users/:Username/movies/favoritemovies/:MovieID', passport.authenticate('jwt', { session: false }), (req, res) => {
	let favMovies = [];
	Users.findOne({ Username: req.params.Username })
		.then((user) => {
			favMovies = user.FavoriteMovies;
			return (
				Movies.findById(req.params.MovieID)
					.then((movie) => {
						if (favMovies.indexOf(movie._id) === -1) {
							res.status(404).send('Movie ' + req.params.MovieID + ' was not found in user ' + req.params.Username + "'s favorites list");
						}
						return Users.findOneAndUpdate(
							//condition for which documents to update
							{ Username: req.params.Username },
							//an object that includes which fields to update and what to update them to
							{
								$pull: { FavoriteMovies: req.params.MovieID },
							},
							{ new: true }
						);
					})
					////for the movies.findbyID promise function after findOneAndUpdate is completed
					.catch(() => res.status(404).send(`Movie id ${req.params.MovieID} not found`))
			);
		})
		.then((user) => {
			if (!user) {
				res.status(404).send('User ' + req.params.Username + ' was not found');
			} else {
				console.log('Movie ID ' + req.params.MovieID + ' was deleted from user ' + req.params.Username);
				res.status(200).send(user);
			}
		})
		.catch((err) => {
			console.error(err);
			res.status(500).send('Error: ' + err);
		});
});

/**
 * DELETE a movie from To Watch list
 * Allow users to remove a movie from their To Watch list
 * @param {Username}
 * @param {MovieID}
 */
app.delete('/users/:Username/movies/towatch/:MovieID', passport.authenticate('jwt', { session: false }), (req, res) => {
	Movies.findById(req.params.MovieID)
		.then(() =>
			Users.findOneAndUpdate(
				//condition for which documents to update
				{ Username: req.params.Username },
				//an object that includes which fields to update and what to update them to
				{
					$pull: { ToWatch: req.params.MovieID || '' },
				},
				{ new: true }
			) //promise function after findOneAndUpdate is completed
				.then((user) => {
					if (!user) {
						res.status(404).send('User ' + req.params.Username + ' was not found');
					} else {
						console.log('Movie ID ' + req.params.MovieID + ' was deleted from ' + req.params.Username + '\'s "To Watch" list');
						res.status(200).send(user);
					}
				})
				.catch((err) => {
					console.error(err);
					res.status(500).send('Error: ' + err);
				})
		)
		.catch(() => res.status(404).send(`Movie id ${req.params.MovieID} not found`));
});

/**
 * DELETE user
 * Allow existing users to deregister
 * @param {Username}
 */
app.delete('/users/:Username', passport.authenticate('jwt', { session: false }), (req, res) => {
	Users.findOneAndRemove({ Username: req.params.Username })
		.then((user) => {
			//check whether a document with the searched-for username even exists
			if (!user) {
				res.status(404).send(req.params.Username + ' was not found');
			} else {
				res.status(200).send('User ' + req.params.Username + ' was deleted.');
			}
		})
		.catch((err) => {
			console.error(err);
			res.status(500).send('Error: ' + err);
		});
});

const port = process.env.PORT || 8080;
app.listen(port, '0.0.0.0', () => {
	console.log('Listening on Port ' + port);
});
