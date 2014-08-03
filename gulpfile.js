var gulp = require('gulp');
var webserver = require('gulp-webserver');
var annotate = require('gulp-ng-annotate');
var usemin = require('gulp-usemin');
var minifyCss = require('gulp-minify-css');
var rev = require('gulp-rev');
var uglify = require('gulp-uglify');
var ghPages = require('gulp-gh-pages');

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

gulp.task('stage-html', function() {
  gulp.src(['./app/**/*.html', '!./app/index.html'], { base: './app' })
    .pipe(gulp.dest('build/'));
});

gulp.task('stage-images', function() {
  gulp.src(['./app/**/*.gif'], { base: './app' })
    .pipe(gulp.dest('build/'));
});

gulp.task('usemin', function() {
  gulp.src('./app/index.html')
    .pipe(usemin({
      css: [minifyCss(), 'concat', rev()],
      js: [annotate(), uglify(), rev()]
    }))
    .pipe(gulp.dest('build/'));
});

gulp.task('build', ['stage-html', 'stage-images', 'usemin']);

gulp.task('deploy', function() {
  gulp.src('./build/**/*')
    .pipe(ghPages());
});

