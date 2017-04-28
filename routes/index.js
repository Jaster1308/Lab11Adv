var express = require('express');
var router = express.Router();
var Lake = require('../models/lake');

/* GET home page. */
router.get('/', function(req, res, next) {
    Lake.find(function(err, lakes){
        if (err) {
            return next(err);
        }
        res.render('index', {title: 'Lake Runner', lakes: lakes});
    });
});

// POST home page
router.post('/', function( req, res, next){
    // Creates empty object.
    var lakeData = {};
    // Loops through each data field in req.body
    // and checks if it is blank before assigning
    // to object.
    for (var field in req.body) {
        if (req.body[field]) {
            lakeData[field] = req.body[field];
        }
    }

    // Sets the data object's date field to current date/time.
    lakeData.runDate = Date.now();

    // Instantiates a Lake object using the data object.
    var lake = Lake(lakeData);
    lake.save(function(err, newLake){
        if (err) {
            // Checks for specific error type.
            if (err.name == 'ValidationError') {
                var messages = [];
                for (var err_name in err.errors) {
                    messages.push(err.errors[err_name].message);
                }
                // Adds flash feature to display error(s).
                req.flash('error', messages);
                return res.redirect('/')
            }
            return next(err);
        }
        // Sends back to home page.
        return res.redirect('/')
    })
});

// POST for secondary form, adding another time to Lake.
router.post('/addTime', function(req, res, next) {
    // Checks if data object has a single time value.
    if(!req.body.runTime) {
        // Adds flash feature to display error.
        req.flash('error', 'Need a time entered for ' + req.body.lakeName);
        return res.redirect('/');
    }
    // Searches for the Lake object.
    Lake.findById(req.body._id, function(err, lake) {
        if (err) {
            return next(err);
        }
        if (!lake) {
            res.statusCode = 404;
            return next(new Error('Lake with id ' + req.body._id + ' not found'))
        }
        // Adds run time to the array of run times for that Lake.
        lake.runTimes.push(req.body.runTime);

        // Sorts the array.
        lake.runTimes.sort(function(a, b) {
            if (a < b) { return -1; }
            if (a > b) { return 1; }
            return 0;
        });
        // Saves the Lake object.
        lake.save(function(err) {
            if (err) {
                if (err.name == 'ValidationError') {
                    var messages = [];
                    for (var err_name in err.errors) {
                        messages.push(err.errors[err_name].message);
                    }
                    req.flash('error', messages);
                    return res.redirect('/')
                }
                return next(err);
            }
            return res.redirect('/');
        })
    });
});

module.exports = router;
