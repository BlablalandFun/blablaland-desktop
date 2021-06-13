const cp = require("child_process");
const gulp = require("gulp");

const buildReact = (cb) => {
  cp.exec("npm run react-build", (err, out) => {
    if (err) {
      console.error(err.message);
    }
    console.log(out);

    cb();
  });
};

const copyPkg = (cb) => {
  gulp.src("./package.json").pipe(gulp.dest("./build/"));

  cb();
};

const buildElectron = (cb) => {
  cp.exec("npm run electron-build", (err, out) => {
    if (err) {
      console.error(err.message);
    }

    console.log(out);

    cb();
  });
};

const releaseElectron = (cb) => {
  cp.exec("npm run release", (err, out) => {
    if (err) {
      console.error(err.message);
    }

    console.log(out);

    cb();
  });
};

exports.build = gulp.series(buildReact, copyPkg, buildElectron);
exports.release = gulp.series(buildReact, copyPkg, releaseElectron);
