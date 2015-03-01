'use strict';
 
var ENV = process.env.NODE_ENV || 'development';


//import
var gulp = require('gulp');
var typescript = require('gulp-typescript');
var clean = require('gulp-clean');
var merge = require('merge2');
//var path = require('path');

var tsProject = typescript.createProject({
  target: 'es5',
  module: 'amd',
  declarationFiles: true,
  //noExternalResolve: true
  removeComments: ENV === 'production'
});
var paths = {
  src: ['src/main/typescript/**/*.ts', 'src/test/typescript/**/*.ts']
};
 
gulp.task('default' , ['clean', 'compile']);

gulp.task('clean', [ 'typescript:clean' ]);

gulp.task('compile', [ 'typescript:compile' ]);

gulp.task('watch', function () {
  gulp.watch(paths.src, ['typescript:compile']);
});

gulp.task('typescript:compile', function() {
  var tsResult = gulp.src(paths.src)
                     .pipe(typescript(tsProject));

  return merge([
    tsResult.dts.pipe(gulp.dest('target/definitions')),
    tsResult.js.pipe(gulp.dest('target/js'))
  ]);
});

gulp.task('typescript:clean', function() {
  return gulp
    .src([
      'target/definitions/**/*.d.ts', 
      'target/js/**/*.js'
    ], { read: false })
    .pipe(clean());
});