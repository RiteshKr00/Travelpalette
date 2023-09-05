const passport = require("passport");
const { User } = require("../models/user");
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = process.env.SECRET; //Change Later
/*
create various strategy using passport inbuilt function(same as creating own middleware(verify))
It is accessed using passport authenticate("strategy").passport has all function written which we write manually
jwt_payload==writing own isAuthenticated

*/
//Local strategy with jwt
passport.use(
  new JwtStrategy(opts, (jwt_payload, done) => {
    console.log("Received JWT:", jwt_payload);
    User.findById(jwt_payload.id)
      .then((user) => {
        if (user) {
          return done(null, user); //return ID only or whole
        }
        return done(null, false);
      })
      .catch((err) => console.log(err));
  })
);

