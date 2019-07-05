const sqlite3 = require("sqlite3").verbose();
const dbFileName = "database/Flashcards.db";
const db = new sqlite3.Database(dbFileName);

/** UNCOMMENT THIS IF YOU HAVE NOT MADE A TABLE **/
//  let cmdStr = 'CREATE TABLE Flashcards (user INT, english TEXT, translation TEXT, shown INT, correct INT)';
// let cmdStr = 'CREATE TABLE Userbase (googleid INT, firstname TEXT, lastname TEXT)';
// db.run(cmdStr,(err) => {
//   if(err) {
//     console.log("Table creation error",err);
//   } else {
//     console.log("Database created");
//   }
// })

function saveToDB(qObj, req, res) {
  let id = req.user.rowID;
  let cmdStr = 'SELECT user FROM Flashcards WHERE user='+id+' and english="'+qObj.english+'"';
  db.get(cmdStr, (err,row)=> {
    if (err) {
      console.log("Error in 'saveToDB' when checking for double cards, ", err);
    } else if (!row) {
      cmdStr = 'INSERT INTO Flashcards (user, english, translation, shown, correct) VALUES(@0, @1, @2, 1, 0)';
      db.run(cmdStr, req.user.rowID, qObj.english, qObj.russian, (err) => {
        if (err) {
          console.log("Table insert error," + err);
        } else {
          console.log("Succesful insert");
        }
      });
    } else {
      console.log("User already has this card");
    }
  });
  res.send('Sent insert request');
}

function saveToUser(profile){
  let cmdStr = 'INSERT INTO Userbase (googleid, firstname, lastname) VALUES(@0, @1, @2)';
  db.run(cmdStr, profile.id,profile.name.givenName,profile.name.familyName,
    function(err) {
      if(err){
        let msg = "Table insert error, " + err;
        console.log(msg);
      } else {
        let msg = "Succesful UserID insert";
        console.log(msg);
      }
    });
}

function isPresent(profile) {
  let cmdStr = 'SELECT googleID FROM Userbase WHERE googleID = ' + profile.id;
  db.get(cmdStr, (err, row) => {
    if (err) {
      console.log("Error in 'isPresent'",err);
    } else if (!row){
      saveToUser(profile);
      console.log("Added new user to db");
    } else {
      console.log("Found user in db");
    }
  })
}

function getName(id, res) {
  console.log("in get name");
  let cmdStr = 'SELECT firstname,lastname FROM Userbase WHERE googleid ='+id;
  db.get(cmdStr, (err,row) => {
    if (err) {
      console.log("Error in 'getName'",err);
    } else if(row) {
      console.log("Row: ",row);
      res.send({name: row.firstname});
    } else {
      console.log("Error, no row for user, should make entry for them");
    }
  })
}

function updateTable(id, seen, correct) {
  let cmdStr = "";
  if (seen) {
    cmdStr = 'UPDATE Flashcards SET shown='+seen+' WHERE user='+id;
  } else {
    cmdStr = 'UPDATE Flashcards SET correct='+correct+' WHERE user='+id;
  }
  db.run(cmdStr, (err) => {
    if (err) {
      console.log("Error in 'updateTable', ",err);
    } else {
      console.log("Succesful update");
    }
  })
}

exports.saveToDB = saveToDB;
exports.isPresent = isPresent;
exports.updateTable = updateTable;
exports.getName = getName