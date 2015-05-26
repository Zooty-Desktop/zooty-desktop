'use strict';

module.exports = function(app, passport) {
  
  //route for facebook authentication and login
  app.get('/auth/facebook', passport.authenticate('facebook', {scope: 'email'}));

  //handles callback after facebook has authenticated the user
  app.get('/auth/facebook/callback', 
    passport.authenticate('facebook', {
      successRedirect: '/profile', //can adjust page names
      failureRedirect: '/'
    }));

  //route for logging out
  app.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/'); //sends user to homepage after logout
  });

  //route middleware that ensures user is logged in 
  function isLoggedIn(req, res, next) {

    //if user is authenticated in session - continue
    if(req.isAuthenticated()) return next();

    //if user is not authenticated send to homepage
    res.redirect('/');
  }
};