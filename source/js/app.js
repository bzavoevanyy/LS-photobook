'use strict';

$(function(){
  $('#front').on('click', function(e) {
    e.preventDefault();
      $('.flipper').css('transform', 'rotateY(180deg');
  });
});

$(document).ready(function(){
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
$(window).scroll(function(){
    if ($(window).scrollTop() > 300) {
        $('.header-fixed').addClass('top');
    }
    else {
        $('.header-fixed').removeClass('top');
    }
});
