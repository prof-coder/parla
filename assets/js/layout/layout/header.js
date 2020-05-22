
import $ from 'jquery';

const headerElement = '.header_section';

/* Search Form */
const searchBtn = `${headerElement} .search_btn`;
const searchBarDesktop = `${headerElement} .header_section__search_bar`;
const searchBarCloseBtn = `${headerElement} .search_bar__inner a`;

/* Mobile Menu */
const expandBtn = `${headerElement} .js-btn-mobile-expand`;
const mobileNavigation = `${headerElement} .mobile-nav`;

$(document).ready(() => {

  /* Desktop | Navbar Search Form */
  if ($(searchBarDesktop).isTemplateExist() && $(searchBtn).isTemplateExist()) {
    $(searchBtn).click(() => {
      desktopSearchBarToggle();
    });

    $(searchBarCloseBtn).click(() => {
      desktopSearchBarToggle();
    });
  }

  /* Mobile | Navigation */
  if ($(expandBtn).isTemplateExist()) {
    $(expandBtn).click((event) => {
      event.preventDefault();
      if ($(window).width() < 1088) {
        $(expandBtn).toggleClass('mobile_menu_opened');
        $(mobileNavigation).toggleClass('inactive');
      }
    });
  }
});

function desktopSearchBarToggle() {
  if ($(searchBarDesktop).isTemplateExist()) {
    $(searchBarDesktop).toggleClass('active');
  }
}
