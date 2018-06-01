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
        res.redirect('/student_homepage');
    });

    router.get('/student_homepage', function(req, res){
        // finds a student using the user's id
        Student.findById(req.user._id, function(err, student) {
            if (err) {
                throw err;
                res.redirect('/auth/logout');
            } 
            res.render('student_homepage.ejs', { student: req.user, admin: null });

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

    router.get('/admin_homepage', function(req, res) {
        Class.find().populate('professor').sort({'course.code': 1}).exec(function(err, classes) {
            if (err) throw err;
            console.log(classes.length)
            Professor.find().sort({'lastName': 1}).exec(function(err, professors) {
                if (err) throw err;
                console.log(professors.length)
                res.render('admin_homepage.ejs', {clx: classes, professors: professors});
            })
        })
    })

    router.get('/faculty_list', function(req, res) {
        Professor.find().sort({'lastName': 1}).exec(function(err, professors) {
            res.render('faculty_list.ejs', {professors: professors})})
    })
    // from form.ejs
    router.post('/submit_evaluation/:_id', function(req, res) {
        Professor.findById(req.params._id, function(err, professor) {

        })
    })

    // from form.ejs
    router.post('/create_class', function(req, res) {
        console.log(req.body);
        var name = req.body.courseName;
        var code = req.body.courseCode;
        var units = req.body.courseUnits;
        var section = req.body.section;
        var day = req.body.day;
        var time = req.body.time;
        var room = req.body.room;
        var professorId = req.body.professorId;

        var newClass = new Class({
            _id: new mongoose.Types.ObjectId(),
            course: {
                code: code,
                name: name,
                units: units
            },
            section: section,
            schedule: {
                day: day,
                time: time,
                room: room
            },
            professor: professorId
        })

        newClass.save(function(err, newClass) {
            if (err) throw err;
            console.log(newClass);
        });
        res.redirect('/admin_homepage');
    })

    router.post('/add_faculty', function(req, res) {
        console.log(req.body);
        var newProf = new Professor({
            _id: new mongoose.Types.ObjectId(),
            firstName: req.body.firstName,
            lastName: req.body.lastName,
        })
        newProf.save(function(err, newProf) {
            if (err) throw err;
            console.log(newProf);
        })
        res.redirect('/admin_homepage');
    })

    /*User.find({'$or':[{'firstName': {'$regex': req.body.searchQuery, '$options':'i'}},
                        {'lastName': {'$regex': req.body.searchQuery, '$options':'i'}},
                        {'username': {'$regex': req.body.searchQuery, '$options':'i'}}]})*/
        
}