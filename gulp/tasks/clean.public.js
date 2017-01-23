'use strict';

module.exports = function () {
  $.gulp.task('clean:public', function (cb) {
    return $.del('./server/public/assets', cb);
  });
};
