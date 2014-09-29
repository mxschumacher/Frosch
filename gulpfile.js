var gulp = require('gulp');
var connect = require('gulp-connect');
var browserSync = require('browser-sync');

// Static server
gulp.task('browser-sync', function() {
	browserSync({
		server: {
			baseDir: "./"
		}
	});
});

gulp.task('browser-sync', function() {
	browserSync({
		proxy: "http://localhost:8080/"
	});
});

gulp.task('webserver', function() {
	connect.server({
		livereload: true
	});
});

gulp.task('default', ['webserver']);