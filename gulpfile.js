const cp = require('child_process');
const gulp = require('gulp');

const buildReact = (cb) => {
    cp.exec("npm run react-build", (err, out) => {
        if (err) {
            console.error(err.message);
        }

        cb();
    });
    // cb();
};

const copyPkg = (cb) => {
    gulp.src('./package.json').pipe(gulp.dest('./build/'));

    cb();
};

const buildElectron = (cb) => {
    cp.exec("npm run electron-build", (err, out) => {
        if (err) {
            console.error(err.message);
        }

        cb();
    });
};

exports.release = gulp.series(buildReact, copyPkg, buildElectron);


exports.build = gulp.series(buildReact, copyPkg, buildElectron);