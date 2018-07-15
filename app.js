const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session');
const passport = require('passport');;

const config = require('./config/config');
var mysql = require('mysql');


/**
 * This middleware provides a consistent API
 * for MySQL connections during request/response life cycle
 */
var myConnection  = require('express-myconnection')

var dbOptions = {
    user: config.database.user,
    password: config.database.password,
    host: config.database.host,
    database: config.database.db
};

var con = mysql.createConnection(dbOptions);




//check DB connect
/*con.connect((err)=>{
    if(err) throw console.log(err);
    console.log('connected database: ');
});*/

const expressValidator = require('express-validator');
//Express Validator
const { check, validationResult } = require('express-validator/check');

// Init App
const app = express();
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: false}))

/**
 * 3 strategies can be used
 * single: Creates single database connection which is never closed.
 * pool: Creates pool of connections. Connection is auto release when response ends.
 * request: Creates new connection per new request. Connection is auto close when response ends.
 */
app.use(myConnection(mysql, dbOptions, 'pool'));

// parse application/json
app.use(bodyParser.json())


// Load View Engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Load static view in Public
app.use(express.static(path.join(__dirname, 'public')));

// Express Session Middleware
app.use(session({
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: true
}));

// Express Message Middleware
app.use(require('connect-flash')());
app.use(function (req, res, next) {
    res.locals.messages = require('express-messages')(req, res);
    res.locals.message = null;
    res.locals.errors = null;
    next();
});

//Express Validator
app.use(expressValidator());

// Passport Config
require('./config/passport')(passport);
// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

app.get('*', function(req, res, next){
    res.locals.user = req.user || null;
    next();
})

// Home Route
app.get('/', function (req, res) {
    console.log('hmm1');
    res.render('index', {
        title: 'Home',
    })
});

// Route files
let users = require('./routes/users');
app.use('/users', users);

app.listen(3000, function () {
    console.log('Server start on port 3000...');
});