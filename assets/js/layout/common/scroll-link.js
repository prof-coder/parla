
$(document).ready(function() {
  if ($('.js-scroll-link').length > 0) {
    initScrollLink();
  }
});

function initScrollLink() {
  var scrollId = '';
  $('.js-scroll-link').click(function(e) {
    e.preventDefault();
    scrollId = $(this).attr('href');
    if (typeof scrollId != 'undefined') {
      if ((scrollId.indexOf('#') != -1) && ($(scrollId).length > 0)) {
        $('html, body').animate({
          scrollTop: $(scrollId).offset().top
        }, 500);
      }
    }
  })
}