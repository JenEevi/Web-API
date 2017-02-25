var express = require('express');
var app = express();


//send our index.html file to the user for the homepage
app.get('/', function(req,res) {
	res.sendFile(path.join(__dirname + '/index.html'));
});

//GET method
app.get('/gets', function(req,res) {

    //Create an object with the query and header info
	var getObject = {query: req.query, headers: req.headers}

	//if the object is empty
	if(Object.keys(req.query).length == 0) {
		res.send(400, "Query information was not sent");
		}

	if(Object.keys(req.headers).length == 0) {
            res.send(400, "Header information was not sent");
        }

	else {
		//sends the query and header contents
		res.send(getObject);
		}

});

//POST Method
app.post('/posts', function(req,res) {

		//Create an object with the query and header info
        var postObject = {query: req.query, headers: req.headers}

        //if the object is empty
        if(Object.keys(req.query).length == 0) {
            res.send(400, "Query information was not sent");
        	}

        if(Object.keys(req.headers).length == 0) {
            res.send(400, "Header information was not sent");
        	}

        else {
            //sends the query and header contents
            res.send(postObject);
        	}

});

//PUT Method
app.put('/puts', function(req,res){

        //Create an object with the query and header info
        var putObject = {query: req.query, headers: req.headers}

        //if the object is empty
        if(Object.keys(req.query).length == 0) {
            res.send(400, "Query information was not sent");
        	}

        if(Object.keys(req.headers).length == 0) {
            res.send(400, "Header information was not sent");
        	}

        else {
            //sends the query and header contents
            res.send(putObject);
        }

});

//DELETE Method
app.delete('/deletes', function(req,res){

    	//Create an object with the query and header info
        var deleteObject = {query: req.query, headers: req.headers}

        //if the object is empty
        if(Object.keys(req.query).length == 0) {
            res.send(400, "Query information was not sent");
        	}

        if(Object.keys(req.headers).length == 0) {
            res.send(400, "Header information was not sent");
        	}

        else {
            //sends the query and header contents
            res.send(deleteObject);
        	}

});

//Handles all the methods
//If an incorrect method is given an error message is shown
app.all('/:no_access', function(req, res){
	res.status(400);
	res.send('Sorry, the method ' + req.method + ' is not allowed');
});

//start the server
app.listen(1337);

//tell ourselves what's happening
console.log('Listening on Port 1337');

