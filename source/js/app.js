'use strict';

$(function(){
  $('#front').on('click', function(e) {
    e.preventDefault();
      $('.flipper').css('transform', 'rotateY(180deg');
  });
});

$(document).ready(function(){

    $('#toggle').click(function() {
        $('div.edit__down').height($('.main-content').height());
        $(this).toggleClass('active');
        $('.edit__header').css('display', 'block');
        $('.edit__down').addClass('open');

    });

    $('#exit').click(function() {
        $('.edit__header').css('display', 'none');
        $('.edit__down').removeClass('open');
    });
});

//scrooll header-fixed
$(window).scroll(function(){
    if ($(window).scrollTop() > 300) {
        $('.header-fixed').addClass('top');
    }
    else {
        $('.header-fixed').removeClass('top');
    }
});


//scroll page
$(document).ready(function() {
    $(".footer-arrow").click(function () {
        $("html,body").animate({"scrollTop": 0}, 'slow');
    });
});
