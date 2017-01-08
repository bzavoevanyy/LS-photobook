'use strict';

module.exports = function () {
  $.gulp.task('watch', function () {
    $.gulp.watch('./source/js/**/*.js', $.gulp.series('webpack'));
    $.gulp.watch('./source/style/**/*.scss', $.gulp.series('sass'));
    $.gulp.watch('./source/template/**/*.pug', $.gulp.parallel(['pug', 'copy:admin']));
    $.gulp.watch('./source/images/**/*.*', $.gulp.series('copy:image'));
  });
};
