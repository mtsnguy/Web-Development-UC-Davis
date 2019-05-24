const express = require('express');
const api = require('./lango-translateAPI');
const db = require('./lango-database');
const port = 59033;

function translationHandler(req, res, next) {
  let rUrl = req.url;
  let qObj = req.query;
  if (qObj.english != undefined) {
    api.makeAPIRequest(qObj, res);
  } else {
    next();
  }
}

function storeHandler(req, res, next) {
  let rUrl = req.url;
  let qObj = req.query;
  console.log(qObj);
  if (qObj.english != undefined && qObj.russian !=  undefined) {
    db.saveToDB(qObj, res);
  } else {
    next();
  }
}

function fileNotFound(req, res) {
  let url = req.url;
  res.type('text/plain');
  res.status(404);
  res.send('Cannot find '+url);
}

// put together the server pipeline
const app = express();
app.use(express.static('public'));
app.get('/translate', translationHandler);
app.get('/store', storeHandler);
app.use( fileNotFound );

app.listen(port, function (){console.log('Listening...');} );
