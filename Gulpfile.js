/**
 * Define extensions
 */
var gulp = require('gulp'),
	gutil = require('gulp-util'),
	compass = require("gulp-compass"),
	filesCached = require('gulp-cache'),
	filesChanged = require('gulp-changed'),
	jsHint = require('gulp-jshint'),
	liveReload = require('gulp-livereload'),
	compressImgs = require('gulp-imagemin'),
	notify = require("gulp-notify"),
	watching = false,
	map = require('map-stream'),
	files = {
		dev: {
			sass: 'assets/sass/**/*.scss',
			css: 'assets/css/*.css',
			js: {
				custom: 'assets/js/*.js',
				lib: 'assets/js/lib/*.js'
			},
			img: 'assets/img/*'
		}
	},
	paths = {
		dev: {
			sass: 'assets/sass/',
			css: 'assets/css/',
			js: 'assets/js/',
			img: 'assets/img/'
		}
	};

/**
 * Define tasks
 */

// Compile Sass via Compass and refresh styles in browser
gulp.task('compileSass', function() {
	return gulp.src(files.dev.sass)
		.pipe(
			compass({
				css: paths.dev.css,
				sass: paths.dev.sass,
				image: paths.dev.img,
				comments: false,
				require: [
					'susy',
					'normalize-scss'
				]
			})
			.on('error', notify.onError({
				message: 'Sass failed. Check console for errors'
			}))
		)
		.pipe(gulp.dest(paths.dev.css))
		.pipe(liveReload())
		.pipe(notify('Compass successfully compiled'));
});

// Error checking scripts
gulp.task('lintScripts', function() {
	return gulp.src(files.dev.js.custom)
		.pipe(jsHint())
		.pipe(jsHint.reporter('default'))
		.on('error', notify.onError(function(file) {
			if (!file.jshint.success) {
				return 'JSHint failed. Check console for errors';
			}
		}));
});

// Compress images
gulp.task('compressImgs', function() {
	gulp.src(files.dev.img)
		.pipe(
			filesCached(
				compressImgs({
					optimizationLevel: 7,
					progressive: true,
					interlaced: true
				})
			)
		)
		.pipe(gulp.dest(paths.dev.img));
});

// Set watch mode
gulp.task('setWatchStatus', function() {
	watching = true;
});

/**
 * Run tasks
 */
gulp.task('watch', ['setWatchStatus'], function() {
	// Processing
	gulp.watch(files.dev.sass, ['compileSass']);
	gulp.watch(files.dev.js.custom, ['lintScripts']);
});

// Default task
gulp.task('default', ['watch']);