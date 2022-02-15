const gulp = require('gulp');
const browserSync = require('browser-sync').create();
const rename = require("gulp-rename");
const uglify = require('gulp-uglify-es').default;

// Static server
gulp.task('serve', function(){
    // Watch for all files change and reload
    gulp.watch('**').on('change', () => {
        browserSync.reload();
    });


    browserSync.init({
        // serve files from root directory
        server: {baseDir: "./"}
    });
});

// uglify JS
gulp.task('uglify', function(){
    return gulp.src(['jquery.scroll-direction.js'])
        .pipe(rename({extname: '.min.js'}))
        .pipe(uglify(/* options */))
        .pipe(gulp.dest("./"));
});

// gulp release
gulp.task('release', gulp.series('uglify'));