const mongoose = require('mongoose'),
  bcrypt = require('bcrypt');
let movieSchema = mongoose.Schema({
    Title: { type: String, required: !0 },
    Description: { type: String, required: !0 },
    Genre: { Name: String, Description: String },
    Director: { Name: String, Bio: String },
    Actors: [String],
    ImagePath: String,
    Featured: Boolean,
  }),
  userSchema = mongoose.Schema({
    Username: { type: String, required: !0 },
    Password: { type: String, required: !0 },
    Email: { type: String, required: !0 },
    Birthday: Date,
    FavoriteMovies: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Movie' }],
  });
(userSchema.statics.hashPassword = (e) => bcrypt.hashSync(e, 10)),
  (userSchema.methods.validatePassword = function (e) {
    return bcrypt.compareSync(e, this.Password);
  });
let Movie = mongoose.model('Movie', movieSchema),
  User = mongoose.model('User', userSchema);
(module.exports.Movie = Movie), (module.exports.User = User);
