var gulp = require('gulp');
var webserver = require('gulp-webserver');
var _ = require('lodash');
var karma = require('karma').server;
var annotate = require('gulp-ng-annotate');
var usemin = require('gulp-usemin');
var minifyCss = require('gulp-minify-css');
var rev = require('gulp-rev');
var uglify = require('gulp-uglify');

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

// TODO: read config from ./karma.conf.js
var karmaConf = {
  frameworks: ['jasmine'],
  files: [
    'app/bower_components/**/angular.js',
    'app/bower_components/**/angular-route.js',
    'app/bower_components/**/angular-mocks.js',
    'app/*.js'
  ],
  browsers: ['Chrome'],
  reporters: ['spec']
};

// Run tests once and exit
gulp.task('test', function(done) {
  karma.start(_.assign({}, karmaConf, { singleRun: true}), done);
});

// Watch for file changes and re-run tests on each change
gulp.task('tdd', function(done) {
  karma.start(_.assign({}, karmaConf, { singleRun: false }), done);
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

