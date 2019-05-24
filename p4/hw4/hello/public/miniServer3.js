const express = require('express')
const port = 59033

function queryHandler(req, res, next) {
    let url = req.url;
    let qObj = req.query;
    
    if (qObj.word != undefined) {
        let msg = qObj.word;
        let palindrome = qObj.word;
        let len = msg.length;
        for(let i = 1 ; i <= len; i++){
            palindrome = palindrome + msg[len - i];
        }
	   res.json( {"palindrome" : palindrome} );
    }
    else {
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
const app = express()
app.use(express.static('/home/sadboy/hello/public'));  // can I find a static file? 
app.get('/query', queryHandler );   // if not, is it a valid query?
app.use( fileNotFound );            // otherwise not found

app.listen(port, function (){console.log('Listening...');} )

