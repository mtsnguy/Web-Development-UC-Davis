"strict mode";

function getInput() {
  let input = document.getElementById('english-card').value;
  // SOURCE: https://stackoverflow.com/questions/1144783/how-to-replace-all-occurrences-of-a-string-in-javascript
  return input.trim();
}

function getTranslation() {
  let trans = document.getElementById('translation-card').value;
  return trans;
}

function displayTranslation(object) {
  let trans = object.Russian;
  let card = document.getElementById('translation-card');
  card.value = trans;
}

function clearCards() {
  document.getElementById('translation-card').value = "";
  document.getElementById('english-card').value = "";
}

function isControlKey(key) {
  // returns true if key code is control key
  // unless key code is for backspace
  if(key < 41 || key == 127) {
    if(key != 8) return true;
  } else if(key > 90 && key < 97) return true;
  return false;
}

function createRequest(method, url) {
  let xhr = new XMLHttpRequest();
  xhr.open(method,url,true);
  return xhr;
}

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

function autoExpand() {
  let engCard = document.getElementById("english-card");
  let transCard = document.getElementById("translation-card");
  let container = document.getElementById("english-card-container");
  let containerHeight = window.getComputedStyle(container).height.replace("px","");

  engCard.style.height = 'auto';
  transCard.style.height = 'auto';

  let h1 = getHeight(engCard);
  let h2 = getHeight(transCard);

  let percentH1 = (h1/containerHeight)*100;
  let percentH2 = (h2/containerHeight)*100;

  engCard.style.height = percentH1 + '%';
  transCard.style.height = percentH2 + '%';
}

export function updateTextAreas(event) {
  // CHECK INPUT IS VALID KEY
  let key = event.which || event.keyCode;
  if(isControlKey(key)) { return; }
  let input = getInput();
  if(input.length > 150) { return; }
  autoExpand();
}

export function requestTranslation(event) {
  let key = event.which || event.keyCode;
  // CHECK FOR CONTROL CHARACTERS
  if(isControlKey(key)) { return; }

  // CHECK FOR BACKSPACE
  let q = (key == 8) ? getInput().slice(0,-1) : getInput() + event.key;

  // DONT TRANSLATE AFTER 150 CHARS
  if(q.length > 150) { return; }

  let url = 'translate?english=' + q;

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

export function saveFlashCard() {
  let trans = getTranslation();
  let eng = getInput();

  if(eng == "") {
    alert("Please enter some text to be translated.");
    clearCards();
    return;
  }

  let url = 'store?english='+eng+'&russian='+trans;

  let xhr = createRequest('GET', url);

  xhr.onload = function() {
    let response = xhr.responseText;
    console.log(response);
    alert("Saved card!");
    clearCards();
  }

  xhr.onerror = function() {
    alert("Failed loading page");
  }

  xhr.send();
}