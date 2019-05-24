const sqlite3 = require("sqlite3").verbose();
const dbFileName = "database/Flashcards.db";
const db = new sqlite3.Database(dbFileName);

/** UNCOMMENT THIS IF YOU HAVE NOT MADE A TABLE **/
//  let cmdStr = 'CREATE TABLE Flashcards (user INT, english TEXT, translation TEXT, shown INT, correct INT)';
//  db.run(cmdStr,tableCreationCallback);

//  function tableCreationCallback(err) {
//    if (err) {
//      console.log("Table creation error",err);
//    } else {
//      console.log("Database created");
//    }
//  }

function saveToDB(qObj, res) {
  let cmdStr = 'INSERT INTO Flashcards (user, english, translation, shown, correct) VALUES(1, @0, @1, 0, 0)';
  db.run(cmdStr, qObj.english, qObj.russian,
    function(err) {
      if(err){
        let msg = "Table insert error, " + err;
        console.log(msg);
      } else {
        let msg = "Succesful insert";
        console.log(msg);
      }
    });
  res.send('Sent insert request');
}

exports.saveToDB = saveToDB;
