import $ from 'jquery';
$(document).ready(function() {
  $('[data-cart-toggle]').click(function() {
    if ($('[data-mini-cart]').length > 0) {
      $('[data-mini-cart]').toggleClass('is-open');
      $('body').toggleClass('menu-open');
    }
  });

  $('[data-mini-cart-close], [data-mini-cart-bg]').click(function(e) {
    e.preventDefault();
    if ($('[data-mini-cart]').length > 0) {
      $('[data-mini-cart]').removeClass('is-open');
      $('body').removeClass('menu-open');
    }
  });
});