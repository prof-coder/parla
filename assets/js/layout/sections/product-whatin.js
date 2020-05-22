/* Slider */
import {initSlider} from '../common/image-slider';
import {CONSTS} from '../../utils';

const selectors = {
  whatin: {
    selector: '.product-whatin .whatin-items .whatin-items-inner',
    options: {
      prevArrow: `<button class="slick-prev" aria-label="Previous" type="button">${CONSTS.arrowLeft}</button>`,
      nextArrow: `<button class="slick-next" aria-label="Next" type="button">${CONSTS.arrowRight}</button>`,
      inifinite: false,
      autoplay: false,
      arrows: true,
      dots: true,
      slidesToShow: 4,
      slidesToScroll: 4,
      responsive: [
        {
          breakpoint: 1087,
          settings: {
            mobileFirst:true,
            slidesToShow: 2,
            slidesToScroll: 1,
          }
        },
        {
          breakpoint: 768,
          settings: {
            mobileFirst:true,
            slidesToShow: 2,
            slidesToScroll: 1,
          }
        },
        {
          breakpoint: 767,
          settings: {
            slidesToShow: 2,
            slidesToScroll: 1,
          }
        },
        {
          breakpoint: 500,
          settings: {
            slidesToShow: 1,
            slidesToScroll: 1,
            dots: false,
          }
        }
      ]
    },
  }
};

$(document).ready(() => {

  var _image_index = 0;

  /** -----------
  *   Init Home Slider
  -----------*/
  if ($(selectors.whatin.selector).isTemplateExist()) {
    initSlider($(selectors.whatin.selector), selectors.whatin.options);
  }
});

$(window).on('resize', function() {
  console.log('resized');
  console.log($(selectors.whatin.selector));
  if ($(selectors.whatin.selector).hasClass('slick-initialized')) {
    console.log('resized');
    $(selectors.whatin.selector).slick('resize');
    setTimeout(function() {
      console.log('setPosition');
      $(selectors.whatin.selector).slick('resize');
    }, 200);
  }
});
