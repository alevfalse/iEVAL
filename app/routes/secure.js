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
            Class.find().populate('professor').sort({'section': 1}).exec(function(err, classes) {
                console.log(classes.length);
                if (err) {
                    throw err;
                    res.redirect('/auth/logout');
                }
                res.render('student_homepage.ejs', { student: req.user, classes: classes });
            })
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
        Class.find().populate('professor').sort({'section': 1}).exec(function(err, classes) {
            if (err) throw err;
            console.log(classes.length)
            Professor.find().sort({'lastName': 1}).exec(function(err, professors) {
                if (err) throw err;
                console.log(professors.length)
                res.render('admin_homepage.ejs', {admin: req.user, classes: classes, professors: professors});
            })
        })
    })

    router.get('/faculty_list', function(req, res) {
        Professor.find().sort({'lastName': 1}).exec(function(err, professors) {
            res.render('faculty_list.ejs', {admin: req.user, professors: professors})})
    })
    // from form.ejs
    router.get('/evaluate/:_id', function(req, res) {
        Class.findById(req.params._id).populate('professor').exec(function(err, cls) {
            console.log(req.user);
            if (err) throw err;
            console.log(cls);
            res.render('form.ejs', { cls: cls, student: req.user });
        })
    })

    router.post('/submit_evaluation/:_id', function (req, res) {

        Professor.findById(req.params._id, function(err, professor) {
            process.nextTick(function() {
                if (err) throw err;
                
                console.log(professor)
                
                b = req.body;
                console.log(b);
                var respect             = b.q1;
                var approachability     = ((parseInt(b.q2) + parseInt(b.q3) + parseInt(b.q4)) / 3);
                var encouragement       = ((parseInt(b.q5) + parseInt(b.q6)) / 2);  
                var fairness            = (parseInt(b.q7) + parseInt(b.q8)) / 2;
                var teaching            = (parseInt(b.q9) + parseInt(b.q10)) / 2;
                var presentation        = (parseInt(b.q11) + parseInt(b.q12) + parseInt(b.q13)) / 3;
                var mastery             = parseInt(b.q14);
                var updated             = parseInt(b.q15);
                var confidence          = parseInt(b.q16); 
                var communication       = (parseInt(b.q17) + parseInt(b.q18)) / 2;
                var punctuality         = parseInt(b.q19);
                var timeManagement      = (parseInt(b.q20) + parseInt(b.q21)) / 2;
                var consistency         = parseInt(b.q22);
                var classManagement     =  parseInt(b.q23);
                var asset               = parseInt(b.q24);

                professor.set({ 'numberEvaluated'           : professor.numberEvaluated+1 });
                professor.set({'attr': { 'respect'          : professor.attr.respect + respect }});
                professor.set({'attr': { 'approachability'  : professor.attr.approachability + approachability }});
                professor.set({'attr': { 'encouragement'    : professor.attr.encouragement + encouragement }});
                professor.set({'attr': { 'fairness'         : professor.attr.fairness + fairness }});
                professor.set({'attr': { 'teaching'         : professor.attr.teaching + teaching }});
                professor.set({'attr': { 'presentation'     : professor.attr.presentation + presentation }});
                professor.set({'attr': { 'mastery'          : professor.attr.mastery + mastery }});
                professor.set({'attr': { 'updated'          : professor.attr.updated + updated }});
                professor.set({'attr': { 'confidence'       : professor.attr.confidence + confidence }});
                professor.set({'attr': { 'communication'    : professor.attr.communication + communication }});
                professor.set({'attr': { 'punctuality'      : professor.attr.punctuality + punctuality }});
                professor.set({'attr': { 'timeManagement'   : professor.attr.timeManagement + timeManagement }});
                professor.set({'attr': { 'consistency'      : professor.attr.consistency + consistency }});
                professor.set({'attr': { 'classManagement'  : professor.attr.classManagement + classManagement} });
                professor.set({'attr': { 'asset'            : professor.attr.asset + asset }});

                professor.save(function(err, updatedProfessor) {
                    if (err) throw err;
                    console.log(updatedProfessor);
                    res.redirect('/student_homepage');
                })
            })
            
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