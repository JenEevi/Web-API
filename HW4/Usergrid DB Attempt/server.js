//HW4 Jennifer Guidotti

var express = require('express');
var app = express();
var bodyparser = require('body-parser');

//using the usergrid npm module
var usergrid = require('usergrid');

//create the basic client object
var Usergrid = require('usergrid');
//initiated based on config file
Usergrid.init();

var client = new usergrid.client({
    logging: true
});

//Get
app.get('/movies', function (req, res, err) {
    //options for the request
    var options = {
        endpoint: "movies", // the collection we are going to query
        qs: {ql: req.query.title}
    }
    client.request(options, function (err, data) {

        if (err) {
            res.send(err)
        }
        else {
            if (req.query == {}) {
                res.send(data)//If user requests entire list
            }
            else {
                res.send(data)
            }
        }
    })

});

//POST
app.post('/movies/addMovie', function (req, res, err) {
    var options = {
        method: 'POST',
        endpoint: 'movies',
        body: {
            title: req.headers.title,
            year: req.headers.year,
            actors: [
                req.headers.actor1,
                req.headers.actor2,
                req.headers.actor3
            ]
        }
    }

    if (!options.body.title) { //If a title wasn't given
        res.json({err: 'No Title Provided'});

    } else if (!options.body.year) {

        res.json({err: 'No Year Provided'});

    } else if (!options.body.actors[0]) {

        res.json({err: 'Sufficient Actors Not Provided, must have 3'});

    } else if (!options.body.actors[1]) {

        res.json({err: 'Sufficient Actors Not Provided, must have 3'});

    } else if (!options.body.actors[2]) {

        res.json({err: 'Sufficient Actors Not Provided, must have 3'});

    } else {

        client.request(options, function (err, data) {
            if (err) { //if there was an error
            } else {
                res.send(data) //Otherwise send the data
            }
        });

    }

});

//DELETE
app.delete('/movies/deleteMovie', function (req, res) {
    var options = {
        method: 'DELETE',
        endpoint: 'movies/' + req.headers.title
    };

    client.request(options, function (err, data) {
        if (err) { //If there was an error
            res.json("Please supply the movie title")
        } else {
            res.json("Deleted Movie Entry!") //Otherwise, send a success statement
        }
    });
});


//If an incorrect method is given an error message is shown
app.all('/:no_access', function (req, res) {
    res.status(400);
    res.json('Sorry, the method ' + req.method + ' is not allowed');
});

//start the server
app.listen(1337);

//tell ourselves what's happening
console.log('Listening on Port 1337')