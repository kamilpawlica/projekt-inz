const GoogleStrategy = require('passport-google-oauth20').Strategy;
const passport = require("passport");
const GOOGLE_CLIENT_ID = "390568549912-qub9mlq0j4rl82hmb8oe87sja6cdctg6.apps.googleusercontent.com"
const GOOGLE_CLIENT_SECRET = "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"
const { addUserToDatabase } = require('./db/connection');

passport.use(
  new GoogleStrategy(
    {
      clientID: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      callbackURL: "/auth/google/callback",
    },
    async function (accessToken, refreshToken, profile, done) {
      // google profile to database
      const userData = {
        google_id: profile.id,
        first_name: profile.name.givenName,
        last_name: profile.name.familyName,
        
        scope: [
          'https://www.googleapis.com/auth/userinfo.profile',
          'https://www.googleapis.com/auth/userinfo.email'
      ]
      };

      // adding user to database
      try {
        await addUserToDatabase(userData);
        done(null, profile);
      } catch (error) {
        done(error, null);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});
