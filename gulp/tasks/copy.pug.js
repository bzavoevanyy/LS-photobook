'use strict';

module.exports = function () {
  $.gulp.task('copy:pug', function () {
    return $.gulp.src('./source/template/**/*.pug')
      .pipe($.gulp.dest('./server/views/'));
  });
};
