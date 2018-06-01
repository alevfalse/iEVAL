var LocalStrategy = require('passport-local').Strategy;
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var configAuth = require('./auth.js');
var fs = require('fs');
var mongoose = require('mongoose');
var Student = require('../app/models/student.js');
var Admin = require('../app/models/admin.js');

module.exports = function(passport) {
    passport.serializeUser(function(user, done) {
        done(null, user.id);  // stores the student id in session
    });

    passport.deserializeUser(function(id, done) {
        Student.findById(id, function(err, user) {
            if (err) throw err;
            if (user) done(err, user);
            else {
                Admin.findById(id, function(err, admin) {
                    done(err, admin);
                })
            }
        });
    });


    // student login using iacademy gmail
    passport.use(new GoogleStrategy({
        clientID: configAuth.googleAuth.clientID,
        clientSecret: configAuth.googleAuth.clientSecret,
        callbackURL: configAuth.googleAuth.callbackURL,
    },
    function(accessToken, refreshToken, profile, done) {
        process.nextTick(function(){
            console.log(profile);
            Student.findOne({'google.id': profile.id}, function(err, user) {
                if(err) return done(err);
                if(user) {
                    console.log(user.firstName + ' already exists. Logging in without creating a Student account in DB.');
                    return done(null, user);
                }
                else {
                    var email = profile.emails[0].value;
                    var index = email.indexOf('@');
                    var studentID = email.substring(0,index)
                    console.log('Email: ' + email);
                    console.log('StudentID: ' + studentID);
                    // if the student id's length is not 9 or the email isn't an iacademy gmail
                    if (studentID.length != 9 || !email.includes('iacademy.edu.ph')) {
                        console.log('Invalid studendID length or not an iacademy email.');
                        return done(null, false);
                    } else {
                        var newStudent = new Student({
                            _id: new mongoose.Types.ObjectId(),
                            ID: studentID,
                            firstName: profile.name.givenName,
                            lastName: profile.name.familyName,
                            google: {
                                id: profile.id,
                                token: accessToken,
                                email: email,
                                name: profile.displayName
                            }
                        })
                        newStudent.save(function(err, newStudent) {
                            if(err) throw err;
                            console.log(newStudent);
                            return done(null, newStudent);
                        })
                    }
                }
            })
        })
    }))


    // admin login
    passport.use('local-admin-login', new LocalStrategy({
        usernameField: 'username',
        passwordField: 'password',
        passReqToCallback: true
    },
    function(req, username, password, done) {

        process.nextTick(function() {
            Admin.findOne({'username': username}, function(err, admin) {
                console.log(admin);
                if (err) { return done(err); }

                if (!admin) {
                    console.log('invalid username');
                    return done(null, false, req.flash('loginMessage', 'Username does not exist.'));
                }

                if (admin.password != password) {
                    return done(null, false, req.flash('loginMessage', 'Password does not match.'))
                }
                console.log
                return done(null, admin); // sends/binds the user object to the request
            })
        })
    }))
}