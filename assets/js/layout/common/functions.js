import $ from 'jquery';

$.fn.extend({
  isTemplateExist() {
    if (this.length > 0) {
      return true;
    }
    return false;
  },
});
