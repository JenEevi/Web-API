//HW3 Jennifer Guidotti

var express = require("express");
var app = express();
var GitHubApi = require("github");

var github = new GitHubApi({
    version: "3.0.0"
});

var AUTH_TOKEN = "84f7041a2a3302c01a253cbcd5cb800ee1234c7d";

github.authenticate({
    type: "oauth",
    token: AUTH_TOKEN
});

app.get('/get', function(req, response) {
    github.users.get({users: 'jengui'}, function(err, res) {
        console.log("Name:", res.data.name);
        console.log("Username:", res.data.login);
        console.log("Error?", err);
        response.send("Name:" + res.data.name + "\nUsername: " + res.data.login);
    });
});

//If an incorrect method is given an error message is shown
app.all('/:no_access', function(req, res){
    res.status(400);
    res.send('Sorry, the method ' + req.method + ' is not allowed');
});

//if an unauthorized status is given, an error message is shown
app.get('/oauth', function(req, res){
    res.status(401);
    res.send("Sorry, but your Authorization is incorrect, please try again");
});

//start the server
app.listen(1337);

//tell ourselves what's happening
console.log('Listening on Port 1337');