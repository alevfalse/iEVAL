module.exports = function(router, passport) {
    var Student = require('../models/student.js');
    var Admin = require('../models/admin.js');

    // LOGIN   ====================================================
    // localhost:8080/auth/
    router.get('/', function(req, res) {
        res.redirect('/auth/login');
    })

    // localhost:8080/auth/login
    router.get('/login', function(req, res) {
        res.render('login.ejs', {message: req.flash('loginMessage')}
    )})
    
    // localhost:8080/auth/google
    router.get('/google', passport.authenticate('google', {scope: ['profile', 'email']}));

    // localhost:8080/auth/google/callback
    router.get('/google/callback',
        passport.authenticate('google', { successRedirect: '/student_homepage', 
                                          failureRedirect: '/auth/login' }));
    
    // localhost:8080/auth/login for admin
    router.post('/login', passport.authenticate('local-admin-login', {
        successRedirect: '/admin_homepage',
        failureRedirect: '/auth/login',
        failureFlash: true
    }));

    // LOGOUT  ===================================================
    // localhost:8080/auth/logout
    router.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/auth');
    })
}