var express = require('express');
var port = 8000;
var app = express();
var passport = require('passport');
var bodyParser = require('body-parser');

var LocalStrategy = require('passport-local').Strategy;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

var expressSession = require('express-session');
app.use(expressSession({ secret: 'mySecretKey'}));

app.use(passport.initialize());

// use serialize library
passport.serializeUser(function (user, done) {
  console.log(user);
  done(null, user.myID);
});

//create a global middleware that intercept the request from  app.post
//and verify if the data is authenticated
							//verify callback function passing the arguments
passport.use('login', new LocalStrategy(function (username, password, done) {
  var authenticated = username === "John" && password === "Smith";

  if (authenticated) {
    return done(null, { myUser:'user', myID: 1234 });
  } else {
    return done(null, false);
  }
}));


//route-level middleware  apply only to the/login route
					//passport.... middleware will use the first argument from passport.use 'login'
app.post('/login', passport.authenticate('login', {
  successRedirect: '/success',
  failureRedirect: '/login'
  // session: false
}));

//success route
app.get('/success', function (req, res){
  res.send("Hey, hello from the server!");
});

//login  route
app.get('/login', function (req, res) {
  res.sendFile(__dirname + '/login.html');
});


app.listen(port, function() {
	console.log('server started, listening on', port);
});



