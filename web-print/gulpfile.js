const gulp = require('gulp');
const del = require('del');
const typescript = require('gulp-typescript');
const tscConfig = require('./tsconfig.json');
const sourcemaps = require('gulp-sourcemaps');
const tslint = require('gulp-tslint');
const browserSync = require('browser-sync');
const reload = browserSync.reload;
const tsconfig = require('tsconfig-glob');
const debug = require('gulp-debug');


// clean the contents of the distribution directory
gulp.task('clean', function () {
  return del('dist/**/*');
});

// copy static assets - i.e. non TypeScript compiled source
gulp.task('copy:assets', ['clean'], function () {
  return gulp.src(['app/**/*', 'index.html', 'assets/app.css', '!app/**/*.ts'], {
      base: './'
    })
    .pipe(gulp.dest('dist'))
});

// copy dependencies
gulp.task('copy:libs', ['clean'], function () {
  return gulp.src([
      'node_modules/angular2/bundles/angular2-polyfills.js',
      'node_modules/systemjs/dist/system.src.js',
      'node_modules/rxjs/bundles/Rx.js',
      'node_modules/angular2/bundles/angular2.dev.js',
      'node_modules/angular2/bundles/router.dev.js',
      'node_modules/angular2/bundles/http.dev.js',
      'bower_components/lodash/dist/lodash.min.js'
    ])
    .pipe(gulp.dest('dist/lib'))
});

// linting
gulp.task('tslint', function () {
  return gulp.src('app/**/*.ts')
    .pipe(debug({title: 'file:'}))
    .pipe(tslint())
    .pipe(tslint.report('verbose'));
});


// TypeScript compile
gulp.task('compile', ['clean'], function () {
  var tsProject = typescript.createProject('tsconfig.json');
  var tsResult = gulp.src('app/**/*.ts')
    .pipe(sourcemaps.init())
    .pipe(typescript(tsProject))
  return tsResult.js
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('dist/app'))
});

// update the tsconfig files based on the glob pattern
gulp.task('tsconfig-glob', function () {
  return tsconfig({
    configPath: '.',
    indent: 4
  });
});

// Run browsersync for development
gulp.task('serve', ['tslint', 'build'], function () {
  browserSync({
    server: {
      baseDir: 'dist'
    }
  });
  gulp.watch(['app/**/*', 'index.html', '*.css'], ['buildAndReload']);
});


gulp.task('watch', function () {
  gulp.watch(['app/**/*', 'index.html', '*.css'], ['build']);
});
gulp.task('build', ['compile', 'copy:libs', 'copy:assets']);
gulp.task('buildAndReload', ['build'], reload);
gulp.task('default', ['build']);
