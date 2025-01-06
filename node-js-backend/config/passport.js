const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const { Client, Psychologist } = require("../models");
const logger = require("./logger");

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/api/auth/google/callback",
      passReqToCallback: true,
    },
    async (req, accessToken, refreshToken, profile, done) => {
      try {
        const userType = req.query.userType || "client"; // varsayılan olarak client
        const email = profile.emails[0].value;
        let user;

        if (userType === "psychologist") {
          // Psikolog için kontrol
          user = await Psychologist.findOne({ where: { email } });

          if (!user) {
            user = await Psychologist.create({
              email: profile.emails[0].value,
              name: profile.name.givenName,
              surname: profile.name.familyName,
              username: profile.emails[0].value.split("@")[0],
              google_id: profile.id,
              status: true,
              email_verified: profile.emails[0].verified || false,
              photo: profile.photos[0]?.value,
            });
            logger.info(`Yeni psikolog Google ile kaydoldu: ${email}`);
          }
        } else {
          // Client için kontrol
          user = await Client.findOne({ where: { email } });

          if (!user) {
            user = await Client.create({
              email: profile.emails[0].value,
              name: profile.name.givenName,
              surname: profile.name.familyName,
              username: profile.emails[0].value.split("@")[0],
              google_id: profile.id,
              status: true,
              email_verified: profile.emails[0].verified || false,
              photo: profile.photos[0]?.value,
            });
            logger.info(`Yeni client Google ile kaydoldu: ${email}`);
          }
        }

        done(null, { user, userType });
      } catch (error) {
        logger.error(`Google OAuth hatası: ${error.message}`);
        done(error, null);
      }
    }
  )
);
