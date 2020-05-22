import $ from 'jquery';

let _domain='', _paramCustomer='';
if (typeof ShopifyDomain != 'undefined') {_domain=ShopifyDomain;}
if (typeof PARAMCustomer != 'undefined') {_paramCustomer=PARAMCustomer;}

$(document).ready(function() {
  if ($('.js-add-to-cart').length > 0) {
    initQuickAddButton();
  }
  if ($('.js-submit-form .js-form-cart').length > 0) {
    initProductForm();
  }
  if ($('.js-link-checkout').length > 0) {
    initCheckoutLink();
  }
});

function initQuickAddButton() {
  $('.js-add-to-cart').click(function(e) {

    var productId = $(this).attr('data-id');
    var quantity = 1;
    if (productId) {
      e.preventDefault();
      addToCart({
        id: productId,
        quantity: 1
      });      
    }
  });
}

function initProductForm() {
  var count = 1, unit="", $form = '', id='', subscription_id='', variantId='';
  $('.js-submit-form .js-form-cart').click(function() {

    if ($(this).hasClass('disabled')) return;

    count = $(this).attr('data-count');
    unit = $(this).attr('data-unit');
    $form = $(this).closest('.js-submit-form');
    variantId = $form.find('input[name="variant_id"]').val();
    subscription_id = $form.find('input[name="subscription_id"]').val();
    id = $form.find('input[name="id"]').val();

    if ($(this).attr('data-id')) {
      id = $(this).attr('data-id');
    }


    if ((typeof count != 'undefined') && (typeof unit != 'undefined')) {
      if ((typeof id != 'undefined') && (typeof subscription_id != 'undefined')) {
        addToCart({
          id: id,
          quantity: 1,
          properties: {
            shipping_interval_frequency: count,
            shipping_interval_unit_type: unit,
            subscription_id: subscription_id
          }
        })
      }
    } else {
      addToCart({
        id: variantId,
        quantity: 1
      })
    }
  });
}

function initCheckoutLink() {
  var paramCart = '', paramDomain='', paramLinker='';
  $('.js-link-checkout').click(function(e) {
    e.preventDefault();
    paramCart = '&cart_token=' + (document.cookie.match('(^|; )cart=([^;]*)')||0)[2];
    $.ajax({
      type: 'GET',
      url: '/cart.js',
      dataType: 'text',
      success: function(data) {
        if (data.indexOf("subscription_id") > -1) {
          paramDomain = `myshopify_domain=${_domain}`;
          try {
            paramLinker = "&" + ga.getAll()[0].get('linkerParam');
          } catch (err) {
            paramLinker = '';
          }
          window.location = "https://checkout.rechargeapps.com/r/checkout?" + paramDomain +  paramCart + paramLinker + _paramCustomer;
        } else {
          window.location = '/checkout';
        }
      }
    });
  });
}

function addToCart(formData) {
  $.ajax({
    url: '/cart/add.js',
    dataType: 'json',
    data: formData,
    success: function(result) {
      /* Open Mini cart */
        if (typeof CartJS != 'undefined') {
          CartJS.getCart();
          $('[data-mini-cart]').addClass('is-open');
          $('body').addClass('menu-open');
        }
    },
    error: function(error) {
      console.log(error);
    }
  });
}