//HW4 Jennifer Guidotti
//using NPM pulled in all the packages that we need.
var express = require('express'); //call express
var app = express(); //define our app using express
var bodyParser = require('body-parser'); //get body-parser
var morgan = require('morgan'); //user to see requests
var port = process.env.PORT || 1337; //set the port for our app
var mongoose = require('mongoose');
var mlab = require('mongolab-data-api')('Bnto1o6AjgUvuhxzIZLPn2rpyvTwidtU');

//App Configuration
//user body parser so we can grab information from POST requests
app.use(bodyParser.urlencoded({ extended: true}));
app.use(bodyParser.json());

//configure our app to handle CORS requests
app.use(function(req, res, next){
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, \ Authorization');
    next();
});

//log all requests to the console
app.use(morgan('dev'));

//Routes for our API
//this section holds all the routers
//=====================

//basic route for the home page
app.get('/', function(req, res){
    res.send('Welcome to the home page for the database!');
});

app.get('/movies', function (req, res){
    var options = {
        database: 'movies',
        collectionName: 'movies'
    }
    mlab.listDocuments(options, function(err, data){
        if(err){res.json('There was an error obtaining the collection')}
        else {
            console.log(data);
            res.json(data);
        }
    });
});

app.post('/movies', function (req, res) {
    var options = {
        database: 'movies',
        collectionName: 'movies',
        documents: {
            "title": req.headers.title,
            "year": req.headers.year,
            "actors": [
                req.headers.actor1,
                req.headers.actor2,
                req.headers.actor3
            ]
        }
    }

    if (!options.documents.title) { //If a title wasn't given
        res.json({err: 'No Title Provided'});

    } else if (!options.documents.year) {

        res.json({err: 'No Year Provided'});

    } else if (!options.documents.actors[0]) {

        res.json({err: 'Sufficient Actors Not Provided, must have 3'});

    } else if (!options.documents.actors[1]) {

        res.json({err: 'Sufficient Actors Not Provided, must have 3'});

    } else if (!options.documents.actors[2]) {

        res.json({err: 'Sufficient Actors Not Provided, must have 3'});

    } else {
        mlab.insertDocuments(options, function(err, data){
            if (err) { //if there was an error
            } else {
                res.send(data) //Otherwise send the data
            }
        });
    }
});

app.delete('/movies', function(req, res) {
    var options = {
        database: 'movies',
        collectionName: 'movies',
        id: {"_id": req.headers._id}
    }
    mlab.deleteDocument(options, function (err, data){
        if (err) {res.send('Please provide the object ID to be deleted');}
        else {
            res.send('Movie has been removed from the database');
            console.log('Delete successful');
        }
    });
});

//start the server
//========
app.listen(port);
console.log('Magic happens on port ' + port);