var gulp = require('gulp');
var webserver = require('gulp-webserver');

gulp.task('webserver', function() {
  gulp.src('app')
    .pipe(webserver({
      livereload: false,
      directoryListing: {
        path: 'app'
      },
      port: 3000,
      host: '0.0.0.0',
      fallback: 'app/index.html'
    }));
});