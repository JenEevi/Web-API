//HW5 Jennifer Guidotti - Modified

var express = require('express');
var app = express();
var bodyparser = require('body-parser');
var async = require("async");
var waterfall = require("async/waterfall");
var parallel = require("async/parallel");


var UsergridClient = require('./node_modules/usergrid/lib/client');

var Usergrid = new UsergridClient
({
    "appId": "sandbox",
    "orgId": "jguidotti",
    "baseUrl": "https://apibaas-trial.apigee.net"
});

var UsergridQuery = require('./node_modules/usergrid/lib/query');

app.use(bodyparser.urlencoded({extended: true}));
app.use(bodyparser.json());

//Gets the movie and its rating for the title entered
function getmoviereviews(req, res, query, rquery){
    async.parallel([
            //First external endpoint
            // Make a request to the movie collection
            //query the movie name
            function (callback){
                //make first request
                //call usergrid then in its callback make this call
                Usergrid.GET(query, function (error, usergridResponse, entities){
                    if (error) {
                        callback(error, null);}
                    else {
                        callback(null, usergridResponse.entities);
                    }
                })
            },
//Second external endpoint
//Make a request to the reviews collection
//query the review with corresponding movie name
            function (callback){
                //same as above
                Usergrid.GET(rquery, function(error, usergridResponse, entities){
                    if (error) {
                        callback(error, null);}
                    else {
                        callback(null, usergridResponse.entities); //make sure to do this in the callback of your request
                    }
                })
            },

        ],
        //Collate results
        //Attach the json body with the movie and the review json body and display them together
        function(err, results) {
            if(err) { console.log(err); res.send(500,"Server Error"); return; }
                res.send({movies: results[0], reviews: results[1]});
            // or similar you could look through the results here an combine it – the points here is you get an array with both objects from the callbacks above
        }
    );

}

//Gets all the movies
app.get('/movies', function (req, res, err) {
    //options for the request req.header.title
    var query = new UsergridQuery('movies'); //select * from movies

    if (req.headers.title)
    {
        query = new UsergridQuery('movies').eq('title', req.headers.title);
    }

    Usergrid.GET(query, function (err2, data) {

        if (err2) {
            res.send(err2)
        }
        else {
            if (req.query == {}) {
                res.send(data);//If user requests entire list
            }
            else {
                res.send(data); //otherwise send the data
            }
        }
    })

});

//Gets one of the movies
app.get('/movies/:title', function (req, res, err) {
    //options for the request req.header.title
    var query = new UsergridQuery('movies'); //select * from movies

    if (req.params.title)
    {
        query = new UsergridQuery('movies').eq('title', req.params.title);
    }

    Usergrid.GET(query, function (err2, data) {

        if (err2) {
            res.send(err2); //send an error
        }
        else {
            res.send(data); //Otherwise send the movie the user requested
        }
    })

});


//Gets the movie reviews for the title requested
app.get('/reviews/:title', function (req, res, err) {
    //options for the request req.header.title
    var query = new UsergridQuery('reviews'); //select * from reviews

    if(req.params.title)
    {
        query = new UsergridQuery('reviews').eq('title', req.params.title);
    }

        Usergrid.GET(query, function (err2, data) {

            if (err2) {
                res.send('There was an error'); //send an error
            }
            else {
                res.send(data); //Otherwise send the movie the user requested
            }
        })

});

//gets the movies and reviews - HW5
app.get('/movies/rating/:title', function (req, res, err) {
    var query = new UsergridQuery('movies'); //Search for all movies
    var rquery = new UsergridQuery('reviews'); //search for all reviews

    if (req.params.title) //if a title was passed
    {
        query = new UsergridQuery('movies').eq('title', req.params.title); //search for that move with the title
        rquery = new UsergridQuery('reviews').eq('title', req.params.title); //search for that review with the title
    }

    getmoviereviews(req, res, query, rquery);

});

//POST: Save a movie
app.post('/movies', function (req, res, err) {

    var query = new UsergridQuery('movies'); //checking if that movie is already in the database

    if (req.params.title)
    {
        query = new UsergridQuery('movies').eq('title', req.params.title);
    }

    if(query == req.params.title) { //if it is in the database, then we exit

        res.json('Sorry, but that movie already exists in the database');
    }

    else {

        var entity = {
            type: 'movies',
            title: req.headers.title,
            year: req.headers.year,
            actors: [
                req.headers.actor1,
                req.headers.actor2,
                req.headers.actor3
            ]
        };


        if (!entity.title) { //If a title wasn't given
            res.json({err: 'No Title Provided'});

        } else if (!entity.year) { //year not given

            res.json({err: 'No Year Provided'});

        } else if (!entity.actors[0]) { //insufficient actors

            res.json({err: 'Sufficient Actors Not Provided, must have 3'});

        } else if (!entity.actors[1]) { //insufficient actors

            res.json({err: 'Sufficient Actors Not Provided, must have 3'});

        } else if (!entity.actors[2]) { //insufficient actors

            res.json({err: 'Sufficient Actors Not Provided, must have 3'});

        }

        else {

            Usergrid.POST(entity, function(err) {
                if (err) {
                    res.send(err);//if there was an error
                } else {
                    res.send(entity); //Otherwise send the data
                }
            });

        }
    }

});

//POST: Save a review - HW5
app.post('/reviews', function (req, res, err) {

    var query = new UsergridQuery('movies'); //checking if that movie is already in the database

    if (req.params.title)
    {
        query = new UsergridQuery('movies').eq('title', req.params.title);
    }

    if(query == req.params.title) { //if it is in the database, then we exit

        res.json('Sorry, but that movie already exists in the database');
    }

    else {

        var entity = {
            type: 'reviews',
            quote: req.headers.quote,
            rating: req.headers.rating,
            rname: req.headers.rname,
            title: req.headers.title
        };


        if (!entity.title) { //If a title wasn't given
            res.json({err: 'No Title Provided'});

        } else if (!entity.rname) { //reviewer name not given

            res.json({err: 'Reviewer Name was not given'});

        } else if (!entity.quote) { //did not provide a quote

            res.json({err: 'You did not provide a quote'});

        } else if (!entity.rating) { //did not provide a rating

            res.json({err: 'Sorry, you must provide a rating'});

        }

        else {

            Usergrid.POST(entity, function(err) {
                if (err) {
                    res.send(err);//if there was an error
                } else {
                    res.send(entity); //Otherwise send the data
                }
            });

        }
    }

});

//DELETE
app.delete('/movies/:title', function (req, res) {

    var query = new UsergridQuery('movies'); //select * from movies

    if(!req.params.title){ //if no title was given
        res.send('Please provide a movie title')
    }

    else if(req.params.title)//checking the title in the database
    {
        query = new UsergridQuery('movies').eq('title', req.params.title);
    }

    Usergrid.DELETE(query, function(error) { //deletes the specific title
        if (error) {
            res.send("There was an error deleting the movie");
        }
        else {
            res.send("Deleted Movie Entry!");
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
console.log('Listening on Port 1337');