/**
 * Submitted klaviyo form with ajax
 * @param  { String } selectedForm ID for submitted form
 * @return { Void }
 */

let $formWrapper = '',
    $formInput = '',
    $formMessage = '';

function ajaxSubmitKlaviyo(selectedForm) {
  KlaviyoSubscribe.attachToForms(selectedForm, {
    success: function($form) {
      $formWrapper = $form.closest('.js-form-subscribe-wrapper');
      if ($formWrapper.length > 0) {
        $formInput = $formWrapper.find('.js-form-subscribe-input');
        $formMessage = $formWrapper.find('.js-form-subscribe-message');
        if (($formInput.length > 0) && ($formMessage.length > 0)) {
          $formInput.addClass('hidden');
          $formMessage.removeClass('hidden');
        }
      }
    }
  });
}
$(document).ready(function() {
  $('.js-form-subscribe').each(function(index) {
    ajaxSubmitKlaviyo(`#${$(this).attr('id')}`);
  });
})
