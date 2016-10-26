var $overlay = $('<div class="overlay"></div>');
var $form = $('.form-wrapper');
var $modalButton = $('.form-toggler');
var $exit = $('<i class="fa fa-close"></i>')

$form.append($exit);
$overlay.append($form);
$('body').append($overlay);


$modalButton.on('click', () => {
  $overlay.slideDown(300);
});

$exit.on('click', () => {
  $overlay.slideUp(350);
});
