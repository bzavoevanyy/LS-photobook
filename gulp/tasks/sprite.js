// Таск генерирует спрайты из графических файлов и ложит их в папку продакшена,
// css-файл кладется в source для дальнейшего использования
'use strict';

module.exports = function () {
  $.gulp.task('sprite', function () {
    // Generate our spritesheet
    var spriteData = $.gulp.src('./source/sprities/*.png').pipe($.gp.spritesmith({
      imgName: 'sprite.png',
      cssName: 'sprite.css'
    }));

    // Pipe image stream onto disk
    var imgStream = spriteData.img
      .pipe($.gulp.dest($.config.root + '/assets/img'));

    // Pipe CSS stream onto disk
    var cssStream = spriteData.css
      .pipe($.gulp.dest('./source/style'));

    // Return a merged stream to handle both `end` events
    return $.merge(imgStream, cssStream);
  })
};
