var gulp = require('gulp')
  , minifyCSS = require('gulp-minify-css')
  , stylus = require('gulp-stylus')
  , nib = require('nib');


// stylus
gulp.task('stylus', function () {
  gulp.src('static/stylus/*.styl')
    .pipe(stylus({error: true, use: [nib()]}))
    .pipe(minifyCSS())
    .pipe(gulp.dest('./static/css/'));
});

gulp.task('watch', function () {
  gulp.watch('static/stylus/*.styl', ['stylus']);
});

gulp.task('default', ['stylus', 'watch']);
