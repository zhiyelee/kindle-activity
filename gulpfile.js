var gulp = require('gulp');
var minifyCSS = require('gulp-minify-css');
var stylus = require('gulp-stylus');
var nib = require('nib');


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
