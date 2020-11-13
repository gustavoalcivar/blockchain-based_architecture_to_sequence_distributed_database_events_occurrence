const passport    = require('passport');
const passportJWT = require("passport-jwt");

const ExtractJWT = passportJWT.ExtractJwt;

const LocalStrategy = require('passport-local').Strategy;
const JWTStrategy   = passportJWT.Strategy;

const User = require('./models/user')
const config = require('./config')

passport.use(
    new LocalStrategy({
        usernameField: 'username',
        passwordField: 'passHash'
    },
    function (username, passHash, callback) {

        return User.findOne({username, passHash})
            .then(user => {
                if (!user) {
                    return callback(null, false, {ok: false, message: 'incorrect_username_or_password'});
                }

                return callback(null, user, {
                    ok: true,
                    message: 'logged_in_successfully'
                });
            })
            .catch(err => {
                return callback(err);
            });
    }
));

passport.use(new JWTStrategy(
    {
        jwtFromRequest   : ExtractJWT.fromAuthHeaderAsBearerToken(),
        secretOrKey      : config.JWT_SECRET,
        passReqToCallback: true
    },
    function (req, jwtPayload, callback) {
        return User._getById(jwtPayload.id, (user, err) => {
            if (err) return callback(err)
            if (user) {
                //req.user = user;
                return callback(null, user);
            }
            return callback(null, false);
        });
    }
));

function authenticateJwt(req, res, next) {
    passport.authenticate('jwt', { session: false }, function(info, user, err) {
        if (err) return next(err);
        if (!user) return next(Error('Unauthorized'));
        req.user = user;
        next();
    })(req, res, next);
}

function isAdmin (req, res, next) {
    if (req.user && req.user.isAdmin) {
        return next()
    }
    return res.status(403).json({ ok: false, message: 'action_unallowed' });
}

module.exports = { authenticateJwt, isAdmin }