const config = require('./config/config');
const dbsetup = require('./setup/dbsetup');

dbsetup().then(function (result) {
    console.log(result);
}).catch(function (err) {
    console.log(err);
});
