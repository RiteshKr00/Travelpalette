const passport = require("passport");
const { User } = require("../models/user");
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const { errorResponse, successResponse } = require("../utils/response");

// const cookieExtractor = (req) => {
//   let token = null;
//   if (req && req.cookies) {
//     token = req.cookies.token; // Replace with the actual name of your JWT cookie
//     console.log("token is ", token);
//   }
//   return token;
// };
// const opts = {};
// opts.jwtFromRequest = cookieExtractor; //ExtractJwt.fromAuthHeaderAsBearerToken();
// opts.secretOrKey = process.env.SECRET; //Change Later
const cookieExtractor = (req) => {
  let token = null;
  console.log("token is ", req.cookies);

  if (req && req.cookies) {
    console.log("token is ", req.cookies.token);

    token = req.cookies.token; // Replace with the actual name of your JWT cookie
  }
  return token;
};

const opts = {
  jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor]),
  secretOrKey: process.env.SECRET,
};
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
//Google OAuth Strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.Client_ID,
      clientSecret: process.env.Client_Secret,
      callbackURL: `${process.env.Base_Url}/api/v1/auth/google/callback`,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        return done(null, profile); //this set req.user=user; can be used later to get user detail
      } catch (error) {
        return done(error);
      }
    }
  )
);
