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

//initialize passport
app.use(passport.initialize());
//initialize session with passport
app.use(passport.session());

// use serialize library, we give an id to the user
passport.serializeUser(function (user, done) {
  console.log(user);
  done(null, user.myID);
});

//uncode the secret key that we used with express session and serialize
passport.deserializeUser(function (user, done) {
  done(null, user);
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
	// console.log(req.user);
  if (!req.isAuthenticated()) {// Denied. Redirect to login
    console.log('DEEEnied');
    res.redirect('/login');
  } else {
    res.send('Hey, hello from the server!');
  }
});

//login  route
app.get('/login', function (req, res) {
  res.sendFile(__dirname + '/login.html');
});

//log out route, wont let you use your session if you logou
app.get('/logout', function (req, res) {
  req.logout();
  res.send('Logged out!');
});


app.listen(port, function() {
	console.log('server started, listening on', port);
});



