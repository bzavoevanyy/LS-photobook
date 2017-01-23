'use strict';
let album = () => {
  let getPhotos = () => {
    let albumId = $('.main-content').data('albumid');
    $.get('/photo/album/' + albumId)
      .done((res) => {
        $('.album-photo__container').html(res);
      })
  };
  let addPhotos = () => {
    $('.add-photo').bPopup();
  };
  let sendFiles = () => {
    let files = $('.input-addfiles')[0].files;
    let formData = new FormData();
    $(files).each((key, file) => {
      formData.append('pic', file);
    });
    $.ajax({
      url: '/album/preloadpic',
      contentType: false,
      processData: false,
      data: formData,
      method: 'POST'
    })
      .done((res) => {
        $('.add-photo__main').addClass('add-photo__main_added');
        $('.add-photo__main').html(res);

      })
  };
  let saveFiles = () => {
    let pics = $('.add-photo__photo');
    let filenames = [];
    let albumId = $('.main-content').data('albumid');
    $(pics).each((key, pic) => {
      filenames.push($(pic).data('filename'))
    });
    console.log(filenames);
    $.post('/photo', {albumId : albumId, filename:filenames})
      .done((res) => {
        $('.add-photo').bPopup().close();
        getPhotos();
      })
  };
  return {
    init: () => {
      if ($('.wrapper').hasClass('album-wrap')) {
        getPhotos();
        $('.add__btn').on('click', () => {
          addPhotos();
        })
        $('.input-addfiles').on('change', () => {
          sendFiles();
        })
        $('.modal__cancel').on('click', () => {
          $('.add-photo').bPopup().close();
        })
        $('.modal__close').on('click', () => {
          $('.add-photo').bPopup().close();
        })
        $('.btn_save').on('click', () => {
          saveFiles();
        })
      }
    }
  }
};

module.exports = album();