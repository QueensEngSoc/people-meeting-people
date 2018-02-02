var express = require('express');
var path = require('path');
var bp = require('body-parser');
const config = require('./config/config');
const server_config = config.server_config;

app = express();
app.use(bp.json());
app.use('/css', express.static(path.join(__dirname, '..', 'client', 'css')));

const PORT = server_config.port;

// gives the user the signup html page at the domain home path
app.get('/', function(request, response){
    // Send to SSO
    // Check if user has created a profile before
    // If profile exists, redirect to homepage
    response.redirect('/SignUp');
});



// GET Requests


app.get('/SignUp', function(request, response){
    response.sendFile(path.join(__dirname, '..', 'client', 'signUpNew.html'));
});   // gives the user the signup html page at the domain home path

app.get('/Home', function(request, response){
    response.sendFile(path.join(__dirname, '..', 'client', 'Homepage.html'));
});   // gives user the homepage of Queen's Housing Connect


app.get('/MyProfile', function(request, response){
    response.sendFile(path.join(__dirname, '..', 'client', 'profile.html'));
});   // shows the user their private profile

app.get('/HousingResources', function(request, response){
    response.sendFile(path.join(__dirname, '..', 'client', 'Housingresources.html'));
});   // shows user their group information

app.get('/MyGroups', function(request, response){
    response.sendFile(path.join(__dirname, '..', 'client', 'groupStatus.html'));
});   // shows user their group information

app.get('/Profile', function(request, response){
    response.sendFile(path.join(__dirname, '..', 'client', 'profile.html'));
});   // shows user another user's public profile

/*
*/


// POST requests

/*
app.post('/NewUser', function(request, response){
    var jsondata;
    var new_user = user()
});   // creates a new user in the database

app.post('/AddToGroup', function(request, response){

});   //adds a user to a group

app.post('/ModifyGroupInfo', function(request, response){

});   // Modify group info. Exact info to be determined
*/

// start the server
app.listen(PORT);
console.log('Listening on port ' + PORT);