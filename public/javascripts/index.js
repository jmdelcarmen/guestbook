$(document).ready(function () {
  //show guestnote form
  $('.form-toggler').click(function (event) {
    event.preventDefault();
    $('.guestnote').css({'top': '50px'});
  });

  //hide guestnote form
  $('.exit .fa').click(function () {
    $('.guestnote').css({'top': '-700px'});
  });

});
