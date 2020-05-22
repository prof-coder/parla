$(document).ready(function() {
  if ($('.product-faqs .faqs-item').length > 0) {
    initProductFaqs();
  }
});

function initProductFaqs() {
  $('.faqs-item .faqs-item--title').click(function() {
    var $content = $(this).closest('.faqs-item').find('.faqs-item--info');
    if ($content.length > 0) {
      $(this).closest('.faqs-item').siblings().find('.faqs-item--info').slideUp();

      if ($(this).hasClass('active')) {
        $content.slideUp();
      } else {
        $content.slideDown();
      }

      $(this).closest('.faqs-item').siblings().find('.faqs-item--title').removeClass('active');
      $(this).toggleClass('active');
    }
  })
}