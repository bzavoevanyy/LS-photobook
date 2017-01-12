'use strict';

$(function(){
  $('#front').on('click', function(e) {
    e.preventDefault();
    $('.flipper').css('transform', 'rotateY(180deg');
  });
});


