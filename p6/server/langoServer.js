const express = require('express');
const passport = require('passport');
const cookieSession = require('cookie-session');
const GoogleStrategy = require('passport-google-oauth20');
const api = require('./lango-translateAPI');
const db = require('./lango-database');
const port = 53504;
const sqlite3 = require("sqlite3").verbose();
const dbFileName = "database/Flashcards.db";
const db1 = new sqlite3.Database(dbFileName);

const googleLoginData = {
  clientID: '753466107810-2kjbh7hnco8g8p6a1dnjcqs45t35vddh.apps.googleusercontent.com',
  clientSecret: 'cLE3wkxsNaZKPinDP9P7UXVt',
  callbackURL: '/auth/redirect'
};

passport.use( new GoogleStrategy(googleLoginData, gotProfile) );

// put together the server pipeline
const app = express();
app.use(cookieSession({
  maxAge: 6 * 60 * 60 * 1000,
  // meaningless random string used by encryption
  keys: ['hanger waldo mercy dance']
}));

// Initializes request object for further handling by passport
app.use(passport.initialize());

// If there is a valid cookie, will call deserializeUser()
app.use(passport.session());

// Public static files
app.get('/*',express.static('public'));

// next, handler for url that starts login with Google.
// The app (in public/login.html) redirects to here (not an AJAX request!)
// Kicks off login process by telling Browser to redirect to
// Google. The object { scope: ['profile'] } says to ask Google
// for their user profile information.
app.get('/auth/google',
  passport.authenticate('google',{ scope: ['profile'] }) );

// Google redirects here after user successfully logs in
// This route has three handler functions, one run after the other.
app.get('/auth/redirect',
  passport.authenticate('google'),
  function(req, res) {
    res.redirect('/auth/accept');
  });

app.get('/auth/accept',
  function(req,res,next){
    res.redirect('../user/lango.html');
  });

// static files in /user are only available after login
app.get('/user/*',isAuthenticated,express.static('.'));

// for translate and store queries
app.get('/translate', translationHandler);
app.get('/store', storeHandler);
app.get('/name', nameHandler);
app.get('/cards', cardHandler);
app.get('/updateTable', updateTableHandler);
app.use( fileNotFound );

// Pipeline is ready. Start listening!
app.listen(port, function (){console.log('Listening...');} );

// function to check whether user is logged when trying to access
// personal data
function isAuthenticated(req, res, next) {
  if (req.user) {
    next();
  } else {
    res.redirect('/login.html');  // send response telling
    // Browser to go to login page
    console.log("redirected browser");
  }
}

// function called during login, the second time passport.authenticate
// is called (in /auth/redirect/),
// once we actually have the profile data from Google.
function gotProfile(accessToken, refreshToken, profile, done) {
  // console.log("Google profile",profile);
  db.isPresent(profile);
  let dbRowID = profile.id;
  done(null, dbRowID);
}

// function for end of server pipeline
function fileNotFound(req, res) {
  let url = req.url;
  res.type('text/plain');
  res.status(404);
  res.send('Cannot find '+url);
}

// Part of Server's sesssion set-up.
// The second operand of "done" becomes the input to deserializeUser
// on every subsequent HTTP request with this session's cookie.
passport.serializeUser((dbRowID, done) => {
  // console.log("SerializeUser. Input is",dbRowID);
  done(null, dbRowID);
});

// Called by passport.session pipeline stage on every HTTP request with
// a current session cookie.
// Where we should lookup user database info.
// Whatever we pass in the "done" callback becomes req.user
// and can be used by subsequent middleware.
passport.deserializeUser((dbRowID, done) => {
  let cmdStr = 'SELECT firstname FROM Userbase WHERE googleid ='+dbRowID;
  db1.get(cmdStr,function(err,row){
    if(err) {
      let msg = "Selection error, " + err;
      console.log(msg);
    } else{
      let userData = {name: row, rowID: dbRowID};
      done(null, userData);//userData gets sent to req.user
    }
  });
});

// function to make google translate api requests
function translationHandler(req, res, next) {
  let qObj = req.query;
  if (qObj.english != undefined) {
    api.makeAPIRequest(qObj, res);
  } else {
    next();
  }
}

// function which stores the users created cards into the database
function storeHandler(req, res, next) {
  let qObj = req.query;
  if (qObj.english != undefined && qObj.russian !=  undefined) {
    db.saveToDB(qObj, req, res);
  } else {
    next();
  }
}

// function to fetch the clients username from the db.
function nameHandler(req, res, next) {
  if (req.user) {
    let name = req.user.name.firstname;
    res.send(name);
  } else {
    next();
  }
}

// function to fetch cards from the user, if any
function cardHandler(req, res, next) {
  if (req.user) {
    let rowID = req.user.rowID;
    let cmdStr = 'SELECT english, translation, shown, correct FROM Flashcards WHERE user='+rowID+' LIMIT 40';
    db1.all(cmdStr, (err, rows) => {
      if (err) {
        console.log("Error in 'cardHandler', ",err);
      } else {
        // console.log("Got cards: ", rows);
        res.send(rows);
      }
    });
  } else {
    next();
  }
}

function updateTableHandler(req, res, next) {
  let q = req.query;
  if (q.shown) {
    db.updateTable(req.user.rowID, q.shown);
    res.send("Updated table succesfully, maybe.");
  } else if (q.correct) {
    db.updateTable(req.user.rowID, undefined, q.correct);
    res.send("Updated table succesfuly, maybe.");
  } else {
    next();
  }
}