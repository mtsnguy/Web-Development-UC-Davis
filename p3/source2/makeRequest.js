"strict mode";

//Get 10 images for animation doppler
let imageArray = []  // global variable to hold stack of images for animation 
let count = 0;          // global var
let count2 = 0;

function addToArray(newImage) {
  if (count < 10) {
    newImage.id = "doppler_"+count;
    newImage.style.display = "none";
    imageArray.push(newImage);
    count = count+1;
    if (count >= 10) {
      //doppler animation here
      setInterval(frame,150);
      function frame(){
        document.getElementById("imga3").src = imageArray[count2].src;
        count2 += 1;
        if(count2 == 10){
          count2 = 0;
        }
      }
    } //end setinterval
  }
}

function tryToGetImage(dateObj) {
  let dateStr = dateObj.getUTCFullYear();
  dateStr += String(dateObj.getUTCMonth() + 1).padStart(2, '0'); //January is 0!
  dateStr += String(dateObj.getUTCDate()).padStart(2, '0');

  let timeStr = String(dateObj.getUTCHours()).padStart(2,'0')
  timeStr += String(dateObj.getUTCMinutes()).padStart(2,'0');

  let filename = "DAX_"+dateStr+"_"+timeStr+"_N0R.gif";
  let newImage = new Image();
  newImage.onload = function () {
    addToArray(newImage);
  }
  newImage.onerror = function() {
  }
  newImage.src = "http://radar.weather.gov/ridge/RadarImg/N0R/DAX/"+filename;
}


function getTenImages() {
  let dateObj = new Date();  // defaults to current date and time
  // if we try 150 images, and get one out of every 10, we should get enough
  for (let i = 0; i < 150; i++) {
    newImage = tryToGetImage(dateObj);
    dateObj.setMinutes( dateObj.getMinutes()-1 ); // back in time one minute
  }
}

getTenImages();

// Do a CORS request to get Davis weather hourly forecast
// Create the XHR object.
function createCORSRequest(method, url) {
  let xhr = new XMLHttpRequest();
  xhr.open(method, url, true);  // call its open method
  return xhr;
}

// Make the actual CORS request.
function makeCorsRequest() {

  let temp = document.getElementById('search').value;
  let url = "http://api.openweathermap.org/data/2.5/forecast/hourly?q="+temp+",US&units=imperial&APPID=0e7cc4066aefaf2cd4708afb3084f7fb"

  let xhr = createCORSRequest('GET', url);

  // checking if browser does CORS
  if (!xhr) {
    alert('CORS not supported');
    return;
  }

  // Load some functions into response handlers.
  xhr.onload = function() {
      let responseStr = xhr.responseText;  // get the JSON string 
      let object = JSON.parse(responseStr);  // turn it into an object
      //this part checks if the given city is valid
      let distancecheck = getDistance(38.5453,-121.7446,object.city.coord.lat,object.city.coord.lon);
      if((distancecheck/1.609) <= 150){
        doForecast(object);
      }else{
        console.log("This location is out of range.");
        document.getElementById("search").value = "Location Not Found";
      }
  };

  xhr.onerror = function() {
    alert('Woops, there was an error making the request.');
  };

  // Actually send request to server
  xhr.send();
}
function doForecast(object){
  //testing purposes below
  // console.log(formatAMPM(new Date(object.list[0].dt_txt)));
  // console.log(Math.round(object.list[0].main.temp)+"°");
  // console.log(object.list[0].weather[0].description);
  //console.log(object.city.name + ","+ object.city.country)

  let temp = formatAMPM(new Date(object.list[17].dt_txt));
  let curtime = temp.split(":");
  let curend = temp.split(" ");
  let tod = daynight(curtime[0],curend[1]);

  let img = doimg(object.list[17].weather[0].description,tod);

  document.getElementById("current").innerHTML="<h4>current </br>"+curtime[0]+curend[1].toUpperCase()+"</h4><img id='currentimg' src='"+img+"'/><h5>"+Math.round(object.list[0].main.temp)+"°</h5>";
  document.getElementById("tabcurrent").innerHTML="<img id='currentimg' src='"+img+"'/> <section id='textbox'> <h4>current </br>"+curtime[0]+curend[1].toUpperCase()+"</h4><h5>"+Math.round(object.list[0].main.temp)+"°</h5></section>";

  document.getElementById("forecast").innerHTML = ""; //this line resets html for new info
  for (var i = 1; i < 6; i++) {
    let img = doimg(object.list[i+17].weather[0].description,tod);
    document.getElementById("forecast").innerHTML+="<div class='block' id = 'block"+i+"'><h6 class='time'>" + formatAMPM(new Date(object.list[i+17].dt_txt)) + "</h6><img class='forecastimg' src='" + img + "'/><h8 class='temp'>" + Math.round(object.list[i+17].main.temp)+"°" + "</h8></div>";
  }
}
function formatAMPM(date) {
  let hours = date.getHours();
  let minutes = date.getMinutes();
  let ampm = hours >= 12 ? 'pm' : 'am';
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  minutes = minutes < 10 ? '0'+minutes : minutes;
  let strTime = hours + ':' + minutes + ' ' + ampm;
  return strTime;
}
function daynight(x,y){
  if(x == 12 && y == "am"){
    return "night"
  }else if(x <= 6 && y == "am"){
    return "night";
  }else if(x >= 6 && y == "pm"){
    return "night";
  }else{
    return "day";
  }
}
function doimg(status,tod){
  let x = "";
  switch(status){
    case "light rain":
      if(tod == "day"){
        x = "../assets/rain-day.svg";
      }else{
        x = "../assets/rain-night.svg";
      }
      break;
    case "overcast clouds":
      x = "../assets/brokencloud.svg";
      break;
    case "broken clouds":
      x = "../assets/brokencloud.svg";
      break;
    case "scattered clouds":
      x = "../assets/scatteredclouds.svg";
      break;
    case "clear sky":
      if(tod == "day"){
        x = "../assets/clearsky.svg";
      }else{
        x = "../assets/clear-night.svg";
      }
      break;
    case "few clouds":
      if(tod == "day"){
        x = "../assets/fewclouds-day.svg";
      }else{
        x = "../assets/fewclouds-night.svg";
      }
      break;
    case "mist":
      x = "../assets/mist.svg";
      break;
    case "thunderstorm":
      x = "../assets/thunderstorms.svg";
      break;
    case "rain":
      if(tod == "day"){
        x = "../assets/rain-day.svg";
      }else{
        x = "../assets/rain-night.svg";
      }
      break;
    case "shower rain":
      x = "../assets/showerrain.svg";
      break;
  }
  return x;
}
// run this code to make request when this script file gets executed 
makeCorsRequest();

function updateLocation(){
//Davis LAT/LON : 38.5453 , -121.7446
  makeCorsRequest();
}

function getDistance(lat1,lon1,lat2,lon2) {
  var R = 6371; // Radius of the earth in km
  var dLat = deg2rad(lat2-lat1);  // deg2rad below
  var dLon = deg2rad(lon2-lon1); 
  var a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
    Math.sin(dLon/2) * Math.sin(dLon/2)
    ; 
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  var d = R * c; // Distance in km
  return d;
}

function deg2rad(deg) {
  return deg * (Math.PI/180)
}