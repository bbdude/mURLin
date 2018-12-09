	// Gulp
var gulp	= require('gulp'),
	zip		= require('gulp-zip'),
	clean	= require('gulp-clean'),
	babel	= require('gulp-babel'),
	shell	= require('gulp-shell'),

	// Helpers
	es		= require('event-stream'),
	rseq	= require('run-sequence'),

	// Manifests
	chrome	= require("./vendor/chrome/manifest"),
	firefox	= require("./vendor/firefox/manifest");

function pipe(src, transforms, dest) {
	if (typeof transforms === 'string') {
		dest = transforms;
		transforms = null;
	}

	var stream = gulp.src(src);
	transforms && transforms.forEach(function (transform) {
		stream = stream.pipe(transform);
	});

	if (dest) {
		stream = stream.pipe(gulp.dest(dest));
	}

	return stream;
}

gulp.task('clean', function () {
	return pipe('./build', [clean()]);
});

gulp.task('cleanBabel', function () {
	return pipe('./babel', [clean()]);
});

gulp.task('babel', function() {
	rseq('cleanBabel');
	return gulp.src('src/js/**/*.js')
		.pipe(babel({
			presets: ['env']
		}))
		.pipe(gulp.dest("./babel/js"));
});

gulp.task('chrome', function () {
	return es.merge(
		pipe('./src/libs/**/*', './build/chrome/libs'),
		pipe('./src/img/**/*', './build/chrome/img'),
		pipe('./src/fonts/**/*', './build/chrome/fonts'),
		pipe('./src/js/**/*', './build/chrome/js'),
//		pipe('./babel/js/**/*', './build/chrome/js'),
		pipe('./src/html/**/*', './build/chrome/html'),
		pipe('./src/css/**/*', './build/chrome/css'),
		pipe('./vendor/chrome/browser.js', './build/chrome/js'),
		pipe('./vendor/chrome/manifest.json', './build/chrome/')
	);
});

gulp.task('firefox', function () {
	return es.merge(
		pipe('./src/libs/**/*', './build/firefox/libs'),
		pipe('./src/img/**/*', './build/firefox/img'),
		pipe('./src/fonts/**/*', './build/firefox/fonts'),
		pipe('./src/js/**/*', './build/firefox/js'),
//		pipe('./babel/js/**/*', './build/firefox/js'),
		pipe('./src/html/**/*', './build/firefox/html'),
		pipe('./src/css/**/*', './build/firefox/css'),
		pipe('./vendor/firefox/browser.js', './build/firefox/js'),
		pipe('./vendor/firefox/manifest.json', './build/firefox/')
	);
});

gulp.task('chrome-dist', function () {
	gulp.src('./build/chrome/**/*')
		.pipe(zip('mURLin-chrome-' + chrome.version + '.zip'))
		.pipe(gulp.dest('./dist/chrome'));
});

gulp.task('firefox-dist', function () {
	gulp.src('./build/firefox/**/*')
		.pipe(zip('mURLin-firefox-' + firefox.version + '.zip'))
		.pipe(gulp.dest('./dist/firefox'));
});

gulp.task('dist', function (cb) {
	return rseq(['clean', 'cleanBabel'], 'babel', ['chrome', 'firefox'], ['chrome-dist', 'firefox-dist'], cb);
});

gulp.task('watch', function () {
	gulp.watch(['./src/js/**/*',
				'./src/css/**/*',
				'./src/html/**/*',
				'./src/img/**/*',
				'./src/fonts/**/*',
				'./vendor/**/*'
			],
			['default']
		);
});

gulp.task('default', function (cb) {
	return rseq(['clean'], ['chrome', 'firefox'], cb);
//	return rseq(['clean', 'cleanBabel'], 'babel', ['chrome', 'firefox'], cb);
});