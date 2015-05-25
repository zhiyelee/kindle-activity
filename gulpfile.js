var gulp = require('gulp')
  , $ = require('gulp-load-plugins')({
    rename: {
      'gulp-minify-css': 'minifyCSS'
    }
  })
  , nib = require('nib');


// stylus
gulp.task('stylus', function () {
  gulp.src('static/stylus/screen.styl')
    .pipe($.stylus({error: true, use: [nib()]}))
    .pipe($.minifyCSS())
    .pipe(gulp.dest('./static/css/'))
    .pipe($.livereload());
});

gulp.task('watch', function () {
  $.livereload.listen();
  gulp.watch('static/stylus/*.styl', ['stylus']);
});
gulp.task('serve', function () {
  $.nodemon({
    scripts: 'app.js'
    , ext: 'js html'
    , execMap: {
      js: 'node --harmony'
    }
  }).on('restart', function (e) {
    console.log(e)
  });
});

gulp.task('default', ['stylus', 'watch', 'serve']);
