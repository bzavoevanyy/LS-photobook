let home = () => {
  let sendCover = () => {
    // TODO need file validation
    let cover = new FormData();
    cover.append('cover', document.querySelector('.input-cover').files[0]);
    $.ajax({
      url :'/album/preloadimg',
      contentType: false,
      processData: false,
      data : cover,
      method : 'POST'
    })
      .done((res) => {
        console.log(res);
        $('.cover-image').attr({'src': res.cover, 'data-filename':res.filename});

      })

  };
  let saveAlbum = () => {
    // TODO need data validation
    let album = {};
    let albumId = $('.albumid-hidden').val();
    album.name = $('#name_album').val();
    album.desc = $('#desc_album').val();
    album.cover = $('.cover-image').attr('src');
    album.filename = $('.cover-image').data('filename');
    album.filename_old = $('.cover-image').data('filename_old');
    album.albumId = albumId;
    console.log(album);
    $.post('/album/' + albumId, album)
      .done((res) => {
        $('#name_album').val('');
        $('#desc_album').val('');
        $('.cover-image').attr('src', '');
        $('.cover-image').data('filename', '');
        $('.albumid-hidden').val('');
        $('.modal__window').bPopup().close();
        renderAlbums();
      })
  };
  let renderPhotos = () => {
    $.get('/photo')
      .done((res) => {
        $('.world__container').html(res);
      }).then(() => {
    })
  };
  let renderAlbums = () => {
    $.get('/album')
      .done((res) => {
        $('.myalbum__container').html(res);
      }).then(() => {
      $('.edit-link__album').on('click', (e) => {
        e.preventDefault();
        editAlbum($(e.currentTarget).data());
      })
    })

  };
  let editAlbum = (albumId) => {
    $.get('album/edit/' + albumId.album)
      .done((res) => {
        console.log(res);
        $('#name_album').val(res.name);
        $('#desc_album').val(res.desc);
        $('.cover-image').attr('src', '/photo/' + res.cover);
        $('.cover-image').attr('data-filename_old', res.filename);
        $('.albumid-hidden').val(res.albumId)
      });
    $('.modal__window').bPopup()
  };
  return {
    init: () => {
      if ($('.wrapper').hasClass('home')){
        renderPhotos();
        renderAlbums();
        $('body').on('click', (e) => {
        });
        $('#addalbum').on('click', (e) => {
          e.preventDefault();
          $('.modal__window').bPopup();
        });
        $('.edit_album-close').on('click', () => {
          $('#name_album').val('');
          $('#desc_album').val('');
          $('.cover-image').attr('src', '');
          $('.cover-image').data('filename', '');
          $('.albumid-hidden').val('');
          $('.modal__window').bPopup().close();
        });
        $('.input-cover').on('change', () => {
          sendCover();
        });
        $('.btn_save').on('click', () => {
          saveAlbum();
        });

      }
    }
  }
};

module.exports = home();