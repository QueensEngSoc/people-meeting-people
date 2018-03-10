const express = require('express');
const path = require('path');
const bp = require('body-parser');
const exphbs = require('express-handlebars');
const config = require('./config/config');
const server_config = config.server_config;
app = express();
app.use(bp.json());
app.use('/css', express.static(path.join(__dirname, '..', 'client', 'css')));  // use css files
app.use('/java', express.static(path.join(__dirname, '..', 'client', 'java')));  // use java files
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');
const PORT = server_config.port;
const DatabaseManager = require('./database/database_manager');
const dbm = new DatabaseManager();

// GET Requests
app.get('/', function(request, response){
    // Send to SSO
    // Check if user has created a profile before
    // If profile exists, redirect to homepage
    response.redirect('/home');
}); // redirect to homepage
app.get('/signUp', function(request, response){
    response.sendFile(path.join(__dirname, '..', 'client', 'html', 'signUpNew.html'));
});   // shows user the signup html page at the domain home path
app.get('/home', function(request, response){
    response.render('home');
});   // shows user the homepage of Queen's Housing Connect
app.get('/myProfile/:id', function(request, response){
    dbm.getUserById(request.params.id).then(function(user) {
        response.render('myProfile', {
            "fullName": user[lit.fields.USER.NAME],
            "program": user[lit.fields.PROFILE.FACULTY],
            "gradYear": user[lit.fields.PROFILE.YEAR],
            "co-ed": user[lit.fields.HOUSING_PREFERENCE.CO_ED_OK]? 'Yes':'No',
            "earlyNight": user[lit.fields.PROFILE.SLEEP_HABITS],
            "pineapple": user[lit.fields.PROFILE.PINEAPPLE_PIZZA]? 'Yes':'No',
            "priceRange": user[lit.fields.HOUSING_PREFERENCE.RENT_MINIMUM] + " - " + user[lit.fields.HOUSING_PREFERENCE.RENT_MAXIMUM],
            "hotdogSandy": user[lit.fields.PROFILE.HOT_DOG_SANDWICH]? 'Yes':'No',
            "housemateQualities": user[lit.fields.HOUSING_PREFERENCE.HOUSE_TYPE]
        });
    })
});   // shows the user their private profile
app.get('/housingResources', function(request, response){
    response.render('housingResources');
});
// app.get('/groupStatus', function(request, response) {
//     response.sendFile(path.join(__dirname, '..', 'client', 'html', 'groupStatus.html'));
// });
app.get('/myGroups/:groupid', function(request, response){
    dbm.getHousingGroupById(request.params.groupid).then(function(group){
        return group.getMembers();
    }).then(function(members) {
        members.forEach(function (member) {
            
        });
        for (i = 0; i < group.numUsers; i++){
            people[i]: {"linkToProfile": "/myProfile/" + group.getMembers()[i].id, "fullName": group.getMembers()[i]};
        }
        response.render('myGroups', people);
    })
});   // shows user their group information

// app.get('/profile/:id', function(request, response){
//     dbm.getUserById(request.params.id).then(function(user){
//         response.render('profile', user.Id);
//     })

// shows user another user's public profile


// POST requests

app.post('/newUser', function(request, response){
    var entries = request.body;
    // parse body
    dbm.createUser({
        netId: entries.netId,
        name: entries.name,
        email: entries.email
    }).then(function (user) {
        return user.updateInfo(entries);
    }).then(function () {
        response.redirect('/MyProfile');
    }).catch(function (err) {
        // do something with the error
    })
});   // creates a new user in the database

/*
app.post('/AddToGroup', function(request, response){

});   //adds a user to a group

app.post('/ModifyGroupInfo', function(request, response){

});   // Modify group info. Exact info to be determined
*/

// start the server
app.listen(PORT);
console.log('Server online at port ' + PORT);