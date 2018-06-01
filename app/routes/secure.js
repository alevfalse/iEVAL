// /app/routs/secure.js

module.exports = function(router) {

    var fs = require('fs');
    var mongoose = require('mongoose')
    var Student = require('../models/professor.js');
    var Admin = require('../models/admin.js');
    var Professor = require('../models/professor.js');
    var Class = require('../models/class')

    // AUTHENTICATION ===========================================
    router.use(function(req, res, next) {
        if (req.isAuthenticated()) {
            //res.set('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
            return next();
        }
        res.redirect('/auth');
    })
    // AUTHENTHICATED ROUTES 
    // the user must be logged in before they can access the following routes

    // localhost:8080/
    router.get('/', function(req, res){
        res.redirect('/deck');
    });

    router.get('/deck', function(req, res){
        // finds a student using the user's id
        Student.findById(req.user._id, function(err, student) {
            if (err) {
                throw err;
                res.redirect('/auth/logout');
            } else if (student) { // if a student is found
                res.render('deck.ejs', { student: req.user, admin: null });
            } 
            // else check if the user is an admin
            else { 
                Admin.findById(req.user._id, function(err, admin) {
                    if (err) {
                        throw err;
                        res.redirect('/auth/logout');
                    } else if (admin) {
                        res.render('deck.ejs', { student: null, admin: req.user })
                    } else {
                        res.redirect('/auth/logout');
                    }
                })
            }
        })
    });

    // when a student presses the evaluate button on a class card
    router.get('/evaluate/:_id', function(req, res) {
        Professor.findById(req.params._id).exec(function(err, professor) {
            if (err) throw err;

            Class.findById(req.params._id).populate('professor')
            .exec(function(err, cls) {
                if (err) {
                    throw err;
                    res.redirect('/deck');
                } else if (cls) {
                    res.render('form.ejs', {cls: cls}) //cls stands for the class found | access prof by cls.professor
                } else {
                    console.log('No class found with that id');
                    res.redirect('/deck');
                }
            })
            res.render;
        })
    })

    // from form.ejs
    router.post('/submit_evaluation/:_id', function(req, res) {
        Professor.findById(req.params._id, function(err, professor) {

        })
    })

    /*User.find({'$or':[{'firstName': {'$regex': req.body.searchQuery, '$options':'i'}},
                        {'lastName': {'$regex': req.body.searchQuery, '$options':'i'}},
                        {'username': {'$regex': req.body.searchQuery, '$options':'i'}}]})*/
        
}