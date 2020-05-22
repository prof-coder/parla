/* Slider */
import {initSlider} from '../common/image-slider';

const selectors = {
  home: {
    selector: '.product .product-main-images',
    options: {
      autoplay: false,
      arrows: false,
      dots: false,
      slidesToShow: 1,
      slidesToScroll: 1,
      fade: true,
    },
  },
  thumbs: {
    selector: '.product .product-nav-thumbs'
  }
};

$(document).ready(() => {

  var _image_index = 0;

  /** -----------
  *   Init Home Slider
  -----------*/
  if ($(selectors.home.selector).isTemplateExist()) {
    initSlider($(selectors.home.selector), selectors.home.options);
  }

  if ($(selectors.thumbs.selector).find('.product-image-item').length > 0) {
    $(selectors.thumbs.selector).find('.product-image-item').first().addClass('active');
  }

  $(selectors.home.selector).on('beforeChange', function(event, slick, currentSlide, nextSlide){
    if ($(selectors.thumbs.selector).find(`.product-image-item[data-index="${nextSlide}"]`).length > 0) {
      $(selectors.thumbs.selector).find(`.product-image-item`).removeClass('active');
      $(selectors.thumbs.selector).find(`.product-image-item[data-index="${nextSlide}"]`).addClass('active');
    }
  });

  $(selectors.thumbs.selector).find(`.product-image-item`).click(function() {
    _image_index = $(this).attr('data-index');

    if (typeof _image_index != 'undefined') {
      if ($(selectors.home.selector).hasClass('slick-initialized')) {
        $(selectors.home.selector).slick('slickGoTo', _image_index);
      }
    }
  })

});
