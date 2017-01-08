'use strict';

module.exports = function () {
  console.log(__dirname);
  $.gulp.task('webpack', function () {
    return $.gulp.src($.path.app)
      .pipe($.webpack(require('../../webpack.config.js')))
      .pipe($.gulp.dest($.config.root + '/assets/js'))
  })
};
