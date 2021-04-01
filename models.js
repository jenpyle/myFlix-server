//Schemas for users and movies
const mongoose = require('mongoose');

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
  FavoriteMovies: [
    { type: mongoose.Schema.Types.ObjectId, ref: 'Movie' },
  ] /*this array of IDs refrence the "db.movies" collection....links "Users" collection to "Movies" collection
  ------We use the singular “Movie” because that is the name of the model which links the movieSchema to its database collection*/,
});

//This will create collections called “db.movies” and “db.users” within the MongoDB database you created in the previous Exercise
let Movie = mongoose.model('Movie', movieSchema);
let User = mongoose.model('User', userSchema);

//This will let you then import these models into your “index.js” file
module.exports.Movie = Movie;
module.exports.User = User;
