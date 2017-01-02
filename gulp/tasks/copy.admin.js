'use strict';

module.exports = function () {
  $.gulp.task('copy:admin', function () {
    return $.gulp.src('./source/template/admin/*.pug')
      .pipe($.gulp.dest($.config.root));
  });
};
