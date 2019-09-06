var gulp = require("gulp");
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');

var fs=require('fs');
var domprops=JSON.parse(fs.readFileSync('json/domprops.json'));

gulp.task('jscompress',function(){
    gulp.src("js/py-analysis-source-4.3.js")
        .pipe(uglify({
            //TODO 这两个属性设置后 压缩出的代码会报错
            // mangle: {
            //     except: ['W','D','E']
            // },
            // mangleProperties:{
            //     reserved:domprops["props"].concat(["_CommandName_","py","ipy","cb","l","L","track","q","getJump","a"])
            // },
            compress: {
                drop_console: true,
                pure_funcs:["log","error","warn"]
            }
        }))
        .pipe(rename('a_4.3.js'))
        .pipe(gulp.dest('js'));
  gulp.src("js/py-analysis-source.js")
    .pipe(uglify({
      //TODO 这两个属性设置后 压缩出的代码会报错
      // mangle: {
      //     except: ['W','D','E']
      // },
      // mangleProperties:{
      //     reserved:domprops["props"].concat(["_CommandName_","py","ipy","cb","l","L","track","q","getJump","a"])
      // },
      compress: {
        drop_console: true,
        pure_funcs:["log","error","warn"]
      }
    }))
    .pipe(rename('a_4.2.js'))
    .pipe(gulp.dest('js'));

  gulp.src("../v2.0/adv-source.js")
    .pipe(uglify({
      //TODO 这两个属性设置后 压缩出的代码会报错
      // mangle: {
      //     except: ['W','D','E']
      // },
      // mangleProperties:{
      //     reserved:domprops["props"].concat(["_CommandName_","py","ipy","cb","l","L","track","q","getJump","a"])
      // },
      compress: {
        drop_console: true,
        pure_funcs:["log","error","warn"]
      }
    }))
    .pipe(rename('a.js'))
    .pipe(gulp.dest('js'));

  gulp.src("js/py-airbnb-source.js")
    .pipe(uglify({
      //TODO 这两个属性设置后 压缩出的代码会报错
      // mangle: {
      //     except: ['W','D','E']
      // },
      // mangleProperties:{
      //     reserved:domprops["props"].concat(["_CommandName_","py","ipy","cb","l","L","track","q","getJump","a"])
      // },
      compress: {
        drop_console: true,
        pure_funcs:["log","error","warn"]
      }
    }))
    .pipe(rename('a_air.js'))
    .pipe(gulp.dest('js'));
});

gulp.task('default',['jscompress']);