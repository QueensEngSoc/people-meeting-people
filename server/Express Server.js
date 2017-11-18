var express = require('express');
var path = require('path');
var bp = require('body-parser');

app = express();
app.use(bp.json());
app.use('/css', express.static(path.join(__dirname, '..', 'client', 'css')));

const PORT = 4000;

// gives the user the signup html page at the domain home path
// Must figure out how to include css part
app.get('/', function(req, res){ //why is there an error in the get here, but not in line 19?
    /* To add: include conditional statement to check if user has already signed in,
    in which case redirect to 'default' page */
    res.redirect('/SignUp');
});

/* gives the user the signup html page at the domain home path
 Must figure out how to include css part*/
app.get('/SignUp', function(req, res) {
    res.sendFile(path.join(__dirname, '..', 'client', 'SignUpNew.html'));
});

app.post('/NewUser', function(req, res)  {
    var jsondata;
    var new_user = user()
});


// start the server
app.listen(PORT);
console.log('Listening on port ' + PORT); //why does this not get logged when running the program?