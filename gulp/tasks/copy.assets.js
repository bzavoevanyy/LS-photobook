'use strict';

module.exports = function () {
  $.gulp.task('copy:assets', function () {
    return $.gulp.src('./build/assets/**/*.*')
      .pipe($.gulp.dest('./server/public/assets/'));
  });
};
