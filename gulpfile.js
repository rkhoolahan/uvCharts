var gulp = require('gulp'),
  sourcemaps = require('gulp-sourcemaps'),
  concat = require('gulp-concat'),
  uglify = require('gulp-uglify'),
  watch = require('gulp-watch'),
  zip = require('gulp-zip'),
  jshint = require('gulp-jshint'),
  eclint = require('eclint'),
  del = require('del'),
  stylish = require('jshint-stylish'),
  packageInfo = require('./package.json');

var paths = {
  "module_begin": ['src/module/module_begin.js'],
  "util": ['src/util/utility.js', 'src/util/config.js', 'src/util/constants.js', 'src/util/register.js', 'src/util/effects.js', 'src/util/palette.js'],
  "gfx": ['src/gfx/graph.js', 'src/gfx/*.js'],
  "module_end": ['src/module/module_end.js'],
  "test": ['src/util/test.js'],
  "release_assets": ['build/uvcharts*.js']
};

gulp.task('clean:dev', function (cb) {
  del(['build/*'], cb);
});

gulp.task('clean:gfx', function (cb) {
  del(['build/uvcharts*.js'], cb);
});

gulp.task('clean:test', function (cb) {
  del(['build/uvtest*.js'], cb);
});

gulp.task('clean:all', function (cb) {
  del(['build/*', 'dist/*'], cb);
});

gulp.task('build:gfx', ['clean:gfx'], function () {
  return gulp.src(paths['module_begin'].concat(paths.util).concat(paths.gfx).concat(paths['module_end']))
    .pipe(sourcemaps.init())
    .pipe(concat('uvcharts.js'))
    .pipe(jshint())
    .pipe(jshint.reporter(stylish))
    /*.pipe(eclint.check({
      reporter: function(file, message) {
        console.error(path.relative('.', file.path) + ':', message);
      }
    }))*/
    .pipe(gulp.dest('build/'))
    .pipe(uglify())
    .pipe(concat('uvcharts.min.js'))
    .pipe(gulp.dest('build/'));
});

gulp.task('build:test', ['clean:test'], function () {
  return gulp.src(paths.test)
    .pipe(sourcemaps.init())
    .pipe(concat('uvtest.js'))
    .pipe(jshint())
    .pipe(jshint.reporter(stylish))
    .pipe(gulp.dest('build/'))
    .pipe(uglify())
    .pipe(concat('uvtest.min.js'))
    .pipe(gulp.dest('build/'));
});

gulp.task('release:gfx', ['build:gfx'], function () {
  return gulp.src(paths["release_assets"])
    .pipe(zip("uvcharts-" + packageInfo.version + ".zip"))
    .pipe(gulp.dest('dist'));
});

gulp.task('watch:gfx', ['build:gfx'], function () {
  return gulp.watch(paths['gfx'].concat(paths['util']), ['build:gfx']);
});

gulp.task('default', ['build:gfx', 'build:test']);
