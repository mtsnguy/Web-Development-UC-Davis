let element = document.getElementById("downbutton");
let element2 = document.getElementById("upbutton");
element.addEventListener("mouseover", mouseOver);
element2.addEventListener("mouseover",mouseOver2);

function mouseOver() {
	document.getElementById("header").className = "slidein";
}
function mouseOver2() {
	document.getElementById("header").className = "slideout";
}
