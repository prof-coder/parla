function initEventAccount() {
  $('.forgotten-pass').click(function(e) {
    e.preventDefault();
    if ($('.form.form--recover').length && $('.form.form--login').length) {
      $('.form.form--login').hide();
      $('.form.form--recover').show();
    }
  });

  $('.loginfrom-link').click(function(e) {
    e.preventDefault();
    if ($('.form.form--recover').length && $('.form.form--login').length) {
      $('.form.form--login').show();
      $('.form.form--recover').hide();
    }
  });
}

$(document).ready(function() {
  initEventAccount();
});