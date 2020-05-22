import $ from 'jquery';
import {initSlider} from '../common/image-slider';

const selectors = {
  home: {
    selector: '.slideshow-container .slideshow',
    options: {
      inifinite: true,
      autoplay: false,
      arrows: false,
      dots: true,
      slidesToShow: 1,
      slidesToScroll: 1,
    },
  },
};

$(document).ready(() => {

  /** -----------
  *   Init Home Slider
  -----------*/
  if ($(selectors.home.selector).isTemplateExist()) {
    initSlider($(selectors.home.selector), selectors.home.options);
  }
});
