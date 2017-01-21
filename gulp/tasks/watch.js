'use strict';

module.exports = function () {
  $.gulp.task('watch', function () {
    $.gulp.watch('./source/js/**/*.js', $.gulp.series(['webpack', 'copy:assets']));
    $.gulp.watch('./source/style/**/*.scss', $.gulp.series(['sass', 'copy:assets']));
    $.gulp.watch('./source/template/**/*.pug', $.gulp.parallel(['pug', 'copy:pug']));
    $.gulp.watch('./source/images/**/*.*', $.gulp.series('copy:image'));
  });
};
