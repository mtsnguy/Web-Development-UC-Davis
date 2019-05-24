var btnMore = document.getElementById('btnMore');
var btnLess = document.getElementById('btnLess');
var main = document.getElementById('main');

btnMore.addEventListener('click', function() {
  main.classList.remove('lessContent');
  main.classList.add('moreContent');
});

btnLess.addEventListener('click', function() {
  main.classList.add('lessContent');
  main.classList.remove('moreContent');
});