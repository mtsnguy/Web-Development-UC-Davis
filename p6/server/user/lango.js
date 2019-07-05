"strict mode";

// Returns the text held in the english card, trimmed of white space.
export function getInput() {
  let input = document.getElementById('english-card').value;
  return input.trim();
}

// Returns the text held in the translation card.
export function getTranslation() {
  let trans = document.getElementById('translation-card').value;
  return trans;
}

// Updates the translation card to hold the translation text.
function displayTranslation(object) {
  let trans = object.Russian;
  let card = document.getElementById('translation-card');
  card.value = trans;
}

// Clears both cards of any text.
export function clearCards() {
  document.getElementById('translation-card').value = "";
  document.getElementById('english-card').value = "";
}

export function clearEntry() {
  document.getElementById('entry-card').value ="";
}

// Returns true if key code is control key (otherthan backspace).
function isControlKey(key) {
  if(key < 41 || key == 127) {
    if(key != 8) return true;
  } else if(key > 90 && key < 97) return true;
  return false;
}

// Returns an HTTP request object for the specified method (get/put).
export function createRequest(method, url) {
  let xhr = new XMLHttpRequest();
  xhr.open(method,url,true);
  return xhr;
}

// Calculates total height of DOM node, including scroll hieght.
function getHeight(obj) {
  // SOURCE https://gomakethings.com/automatically-expand-a-textarea-as-the-user-types-using-vanilla-javascript/
  let computed = window.getComputedStyle(obj);
  let height = parseInt(computed.getPropertyValue('border-top-width'), 10)
  + parseInt(computed.getPropertyValue('padding-top'), 10)
  + obj.scrollHeight
  + parseInt(computed.getPropertyValue('padding-bottom'), 10)
  + parseInt(computed.getPropertyValue('border-bottom-width'), 10);
  return height;
}

/****************************************************
 * Updates the height of the english and translation
 * cards textareas to a percentage of the parent div.
 ****************************************************/
function autoExpand() {
  // GET THE CARDS AND THEIR CONTAINER NODES
  let engCard = document.getElementById("english-card");
  let transCard = document.getElementById("translation-card");
  let container = document.getElementById("english-card-container"); // both cards' containers same size, need only one.
  let containerHeight = window.getComputedStyle(container).height.replace("px","");
  // RESET THEIR HEIGHTS
  engCard.style.height = 'auto';
  transCard.style.height = 'auto';
  // GET TOTAL HEIGHT NEEDED TO DISPLAY TEXT
  let h1 = getHeight(engCard);
  let h2 = getHeight(transCard);
  // CONVERT THE PX HEIGHT TO A % OF THE PARENT DIV
  let percentH1 = (h1/containerHeight)*100;
  let percentH2 = (h2/containerHeight)*100;
  // SET HEIGHT TO NEWLY COMPUTED HEIGHT
  engCard.style.height = percentH1 + '%';
  transCard.style.height = percentH2 + '%';
}

/****************************************************
 * Updates both the English card and Translation card
 * textareas to grow/shrink dynamically as user types.
 ****************************************************/
export function updateTextAreas(event) {
  // CHECK INPUT IS VALID KEY
  let key = event.which || event.keyCode;
  if(isControlKey(key)) { return; }
  let input = getInput();
  if(input.length > 150) { return; }
  autoExpand();
}

// Asks server for translation, done in real time.
export function requestTranslation(event) {
  let key = event.which || event.keyCode;
  // CHECK FOR CONTROL CHARACTERS
  if(isControlKey(key)) { return; }

  // CHECK FOR BACKSPACE
  let q = (key == 8) ? getInput().slice(0,-1) : getInput() + event.key;

  // DONT TRANSLATE AFTER 150 CHARS
  if(q.length > 150) { return; }

  let url = '../translate?english=' + q;

  let xhr = createRequest('GET', url);

  xhr.onload = function() {
    let response = xhr.responseText;
    let object = JSON.parse(response);
    displayTranslation(object);
  }

  xhr.onerror = function() {
    alert("Failed loading page");
  }

  xhr.send();
}

export function flipCard(state) {
  console.log("in flipCard,",state);
  let cardShow = document.getElementsByClassName('flip-card-inner')[0];
  if (state) {
    let str = 'rotateY('+0+'deg)';
    console.log(str);
    cardShow.style.transform = str;
  } else {
    let str = 'rotateY('+(-180)+'deg)';
    console.log(str);
    cardShow.style.transform = str;
  }
}

export function getUserName() {
  let url = '../name';
  let xhr = createRequest('GET',url);

  xhr.onload = function () {
    let userName = document.getElementById('user-name');
    let response = xhr.responseText;
    userName.innerHTML = response;
  }

  xhr.onerror = function() {
    console.log("Something went wrong getting the name.");
  }

  xhr.send();
}