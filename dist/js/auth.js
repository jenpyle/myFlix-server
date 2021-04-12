const jwtSecret = 'your_jwt_secret',
  jwt = require('jsonwebtoken'),
  passport = require('passport');
require('./passport');
let generateJWTToken = (e) => jwt.sign(e, jwtSecret, { subject: e.Username, expiresIn: '7d', algorithm: 'HS256' });
module.exports = (e) => {
  e.post('/login', (e, t) => {
    passport.authenticate('local', { session: !1 }, (s, r, o) => {
      if (s || !r) return t.status(400).json({ message: 'Something is not right', user: r });
      e.login(r, { session: !1 }, (e) => {
        e && t.send(e);
        let s = generateJWTToken(r.toJSON());
        return t.json({ user: r, token: s });
      });
    })(e, t);
  });
};
