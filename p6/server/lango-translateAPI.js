const APIrequest = require('request');
const APIkey = "AIzaSyDbFYBIbxv6kZoCMSIHQGeVW6xAONUyb8o";
const url = "https://translation.googleapis.com/language/translate/v2?key="+APIkey;

function makeAPIRequest(qObj, res) {
  let requestObject =
  {
    "source": "en",
    "target": "ru",
    "q": [qObj.english]
  }
  APIrequest(
  { // HTTP header stuff
    url: url,
    method: "POST",
    headers: {"content-type": "application/json"},
    json: requestObject
  },
    APIcallback
  );
  function APIcallback(err, APIresHead, APIresBody) {
    // gets three objects as input
    if ((err) || (APIresHead.statusCode != 200)) {
      // API is not working
      console.log("Got API error");
      console.log(APIresBody);
    } else {
      if (APIresHead.error) {
      // API worked but is not giving you data
      console.log(APIresHead.error);
      } else {
        // Send translation back
        res.json(
        {
          "English": qObj.english,
          "Russian": APIresBody.data.translations[0].translatedText
        }
        );
      }
    }
  }
}

exports.makeAPIRequest = makeAPIRequest;