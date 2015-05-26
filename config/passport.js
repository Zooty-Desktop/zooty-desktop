'use strict';

var FacebookStrategy = require('passport-facebook').Strategy;
var User = require('../api/models/User');
var configAuth = require('./auth');

module.exports = function(passport) {
  
  //used to serialize the user for the session
  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  //used to deserialize the user
  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
  });

  passport.use(new FacebookStrategy ({
    //pull in appID and secret from auth file
    clientID: configAuth.facebookAuth.clientID,
    clientSecret: configAuth.facebookAuth.clientSecret,
    callbackURL: configAuth.facebookAuth.callbackURL
  },

  //facebook sends back token and profile
  function(token, refreshToken, profile, done) {
    User.findOne({'facebook.id': profile.id}, function(err, user) {
      if(err) return done(err);
      
      if(user) {
        return done(null, user);
      } else {
        var newUser = new User();
        newUser.facebook.id = profile.id;
        newUser.facebook.token = token;
        newUser.facebook.name = profile.name.givenName + ' ' + profile.name.familyName; //accepts facebook user first and last name
        newUser.facebook.email = profile.emails[0].value; //accepts first email sent back from facebook
      
        newUser.save(function(err) {
          if(err)
            throw err;

          return done(null, newUser);
        });
      }
    });
  }));
};