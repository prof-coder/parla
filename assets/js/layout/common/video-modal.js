import $ from 'jquery';
import ParlaVideo from './video-element';

let modalVideo='none';

$(document).ready(function() {
  let $template = '',
      src = '',
      $videoCover = '',
      $videoIframe = '',
      $videoWrapper = '';
  $('.js-video-play').click(function() {
    $videoCover = $(this).closest('.js-video-cover');
    if ($videoCover.length > 0) {
      $videoWrapper = $(this).closest('.js-video-cover').find('.js-video-wrapper');
      if ($videoWrapper.length > 0) {
        $videoWrapper.addClass('active');
        if (modalVideo != 'none') {
          modalVideo.play();
        }
      }
    }
  });
  $('.js-video-close').click(function() {
    $videoCover = $(this).closest('.js-video-cover');
    if ($videoCover.length > 0) {
      $videoWrapper = $(this).closest('.js-video-cover').find('.js-video-wrapper');
      if ($videoWrapper.length > 0) {
        $videoWrapper.removeClass('active');
        if (modalVideo != 'none') {
          modalVideo.pause();
        }
      }
    }
  });
});

$(document).ready(function() {
  var videoType = '', videoId = '', requestHost = '';
  if ($('[data-video-elem]').length > 0) {
    $('[data-video-elem]').each(function(index, template) {
      videoType = $(this).attr('data-video-type');
      videoId = $(this).attr('data-video-id');
      requestHost = $(this).attr('data-request-host');
      modalVideo = new ParlaVideo({
        element: $(this),
        videoType: videoType,
        videoId: videoId,
        requestHost: requestHost,
        controls: false,
        onLoad: function() {
          videoWrapperStatusUpdate('loaded');
        },
        onStart: function() {
          videoWrapperStatusUpdate('started');
        },
        onFinish: function() {
          videoWrapperStatusUpdate('finished');
        },
        onPause: function() {
          videoWrapperStatusUpdate('paused');
        }
      });
    })
  }
});
function videoWrapperStatusUpdate(status) {
  switch(status) {
    case 'loaded':
      console.log('loaded');
      $('.js-video-play').removeClass('hidden');
    break;
    case 'started':
      // console.log('started');
    break;
    case 'finished':
      // console.log('finished');
    break;
    case 'paused':
      // console.log('paused');
    break;
    case 'loading':
    // console.log('loading');
    break;
  }
}
