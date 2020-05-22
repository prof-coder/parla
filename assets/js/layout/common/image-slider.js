import $ from 'jquery';

import 'slick-carousel';

// Adding jQuery to the global scope
global.$ = global.jQuery = $;

/**
 * Init Slider
 * @param  { Object } $sliderHolder DOM Element - slider container
 * @param  { Object } sliderOptions Slider options
 * @return { Void }
 */
export function initSlider($sliderHolder, sliderOptions) {
  $sliderHolder.slick(sliderOptions);
}
