"use strict";
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const { Client, Psychologist } = require("../models");
const logger = require("./logger");

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:3000/api/auth/google/callback",
      passReqToCallback: true,
    },
    async (req, accessToken, refreshToken, profile, done) => {
      try {
        const state = req.query.state;
        const userType = state || "client";
        const email = profile.emails[0].value;
        let user;

        if (userType === "psychologist") {
          // Psikolog için sadece var olan hesapları kontrol et
          user = await Psychologist.findOne({ where: { email } });

          if (!user) {
            // Psikolog bulunamadıysa hata döndür
            logger.error(`Psikolog bulunamadı: ${email}`);
            return done(null, false, {
              message:
                "Psikolog hesabı bulunamadı. Lütfen önce normal kayıt olun.",
            });
          }

          // Google ID'yi güncelle
          if (!user.google_id) {
            user.google_id = profile.id;
            await user.save();
          }
        } else {
          // Client için kontrol ve otomatik kayıt
          user = await Client.findOne({ where: { email } });

          if (!user) {
            // Client yoksa yeni kayıt oluştur
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
          } else if (!user.google_id) {
            // Varolan client için Google ID güncelle
            user.google_id = profile.id;
            await user.save();
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
