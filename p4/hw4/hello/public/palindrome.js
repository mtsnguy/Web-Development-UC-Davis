function doSomething(){
	let temp = document.getElementById('word').value;
	let url = "query?word="+temp;
	let xhr = new XMLHttpRequest();

	xhr.open("GET",url,true);
	xhr.send();
	xhr.onload = function(){
     	 let responseStr = xhr.responseText;
     	 let object = JSON.parse(responseStr);
     	 document.getElementById('outputGoesHere').textContent = object.palindrome;
	};
	xhr.onerror = function(){
    	alert('Woops, there was an error making the request.');
	};
}
