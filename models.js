/**
 * @file Mongoose Models made for Users and Movies.
 * The "business logic layer", translates between the database and the API
 * The models are imported into index.js so the API endpoints can make
 * use of them to query the DB according to the schemas
 */
//Schemas for users and movies
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

let movieSchema = mongoose.Schema({
	Title: { type: String, required: true },
	Description: { type: String, required: true },
	Genre: {
		Name: String,
		Description: String,
	},
	Director: {
		Name: String,
		Bio: String,
	},
	Actors: [String],
	ImagePath: String,
	Featured: Boolean,
});

let userSchema = mongoose.Schema({
	Username: { type: String, required: true },
	Password: { type: String, required: true },
	Email: { type: String, required: true },
	Birthday: Date,
	/**
	 * This array of IDs refrence the "db.movies" collection....links "Users" collection to "Movies" collection
	 * Singular “Movie” bc that is the name of the model which links the movieSchema to its database collection
	 */
	FavoriteMovies: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Movie' }],
	ToWatch: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Movie' }],
});

userSchema.statics.hashPassword = (password) => {
	return bcrypt.hashSync(password, 10);
};

userSchema.methods.validatePassword = function (password) {
	return bcrypt.compareSync(password, this.Password);
};

//Create collections “db.movies” and “db.users” within the MongoDB database
//Moive becomes "movies". Any titles you pass through will come out on the other side as lowercase and pluralized
let Movie = mongoose.model('Movie', movieSchema);
let User = mongoose.model('User', userSchema);

//Export these models to use in “index.js”
module.exports.Movie = Movie;
module.exports.User = User;
