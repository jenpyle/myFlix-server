const passport = require('passport'),
  LocalStrategy = require('passport-local').Strategy,
  Models = require('./src/js/models.js'),
  passportJWT = require('passport-jwt');
let Users = Models.User,
  JWTStrategy = passportJWT.Strategy,
  ExtractJWT = passportJWT.ExtractJwt;
passport.use(
  new LocalStrategy({ usernameField: 'Username', passwordField: 'Password' }, (e, s, r) => {
    console.log(e + '  ' + s),
      Users.findOne({ Username: e }, (e, o) =>
        e
          ? (console.log(e), r(e))
          : o
          ? o.validatePassword(s)
            ? (console.log('finished'), r(null, o))
            : (console.log('incorrect password'), r(null, !1, { message: 'Incorrect password.' }))
          : (console.log('incorrect username'), r(null, !1, { message: 'Incorrect username or password.' }))
      );
  })
),
  passport.use(
    new JWTStrategy(
      { jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(), secretOrKey: 'your_jwt_secret' },
      (e, s) =>
        Users.findById(e._id)
          .then((e) => s(null, e))
          .catch((e) => s(e))
    )
  );
