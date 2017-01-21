'use strict';
import index from './index/index';
import home from './home/home';

$(document).ready(() => {
  index.init();
  home.init();
  $('#toggle').click(function() {

    $(this).toggleClass('active');
      $('.edit__down').toggleClass('open');
      $('.edit__header').css('display', 'block');
  });

  $('#exit').click(function() {
      $(this).toggleClass('active');
      $('.edit__down').removeClass('open');
      $('.edit__header').css('display', 'none');
  });
});

//scrooll
$(window).scroll(function () {
  if ($(window).scrollTop() > 300) {
    $('.header-fixed').addClass('top');
  }
  else {
    $('.header-fixed').removeClass('top');
  }
});
