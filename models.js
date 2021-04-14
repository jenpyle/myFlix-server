//Schemas for users and movies
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

let movieSchema = mongoose.Schema({
  Title: { type: String, required: true },
  Description: { type: String, required: true },
  Genre: {
    //Genre becomes "genres"
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
  ToWatch: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Movie' }],
});

userSchema.statics.hashPassword = (password) => {
  return bcrypt.hashSync(password, 10);
};

userSchema.methods.validatePassword = function (password) {
  return bcrypt.compareSync(password, this.Password);
};

//This will create collections called “db.movies” and “db.users” within the MongoDB database you created in the previous Exercise
let Movie = mongoose.model('Movie', movieSchema); //Moive becomes "movies". Any titles you pass through will come out on the other side as lowercase and pluralized
let User = mongoose.model('User', userSchema);

//This will let you then import these models into your “index.js” file
module.exports.Movie = Movie;
module.exports.User = User;
