var gulp = require("gulp");
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');
var babel = require('gulp-babel')

gulp.task('jscompress',function(){
    gulp.src("js/py-stat.js")
        .pipe(babel())
        .pipe(uglify())
        .pipe(rename('py-stat.min.js'))
        .pipe(gulp.dest('js'));
});

gulp.task('default',['jscompress']);
