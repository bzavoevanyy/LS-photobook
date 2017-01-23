'use strict';
let index = () => {
  const emailPattern = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
  const passwordPattern = /^[a-z0-9_-]{6,18}$/;
  const namePattern = /^[a-z0-9_-]{3,16}$/;
  let runFlip = (possition) => {
    if (possition === 'front') $('.flipper').css('transform', 'rotateY(180deg');
    if (possition === 'back') $('.flipper').css('transform', 'rotateY(0deg');
  };
  let signIn = () => {
    let user = {};
    let email = $('#email').val();
    let password = $('#password').val();
    if (email &&
      typeof email === 'string' &&
      emailPattern.test(email)) {
      user.email = email;
    } else {
      $('.form-block.error').show();
    }
    if (password &&
      typeof password === 'string' &&
      passwordPattern.test(password)) {
      user.password = password;
    } else {
      $('.form-block.error').show();
    }
    if (user.email && user.password) {
      $.post('/signin', user)
        .done((res) => {
          if (res.length > 1) { // TODO handle error from server
            $('.form-block.error').show();
          } else {
            window.location = res[0].redirect;
          }
        });
    }
  };
  let signUp = () => {
    let newUser = {};
    let name = $('#newname').val();
    let email = $('#newemail').val();
    let password = $('#newpassword').val();
    if (email &&
      typeof email === 'string' &&
      emailPattern.test(email)) {
      newUser.email = email;
    } else {
      $('.form-block.error').show();
    }
    if (password &&
      typeof password === 'string' &&
      passwordPattern.test(password)) {
      newUser.password = password;
    } else {
      $('.form-block.error').show();
    }
    if (name &&
      typeof name === 'string' &&
      namePattern.test(name)) {
      newUser.name = name;
    } else {
      $('.form-block.error').show();
    }
    if (newUser.name && newUser.email && newUser.password) {
      $.post('/signup', newUser)
        .done((res) => {
          if (res.length > 1) { //TODO handle error from server
            $('.form-block.error').show();
          } else {
            window.location = res[0].redirect;
          }
        })
    }
  }
  return {
    init: () => {
      if ($('.wrapper').hasClass('index')) {
        $('body').on('click', (e) => {
          e.preventDefault();
          if (e.target.id === 'front') runFlip('front');
          if (e.target.id === 'back') runFlip('back');
          if (e.target.id === 'signin') signIn();
          if (e.target.id === 'signup') signUp();
          if (e.target.id === 'email' || e.target.id === 'password' ||
            e.target.id === 'newname' || e.target.id === 'newemail' ||
            e.target.id === 'newpassword') $('.form-block.error').hide();
        });
      }
    }
  }
};

module.exports = index();
