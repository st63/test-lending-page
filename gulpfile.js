const { src, dest, parallel, series, watch } = require("gulp");
const concat = require("gulp-concat");
const sass = require("gulp-sass");
const autoprefixer = require("gulp-autoprefixer");
const cleancss = require("gulp-clean-css");
const browserSync = require("browser-sync").create();
const imagemin = require("gulp-imagemin");
const posthtml = require("gulp-posthtml");
const include = require("posthtml-include");
const richtypo = require("posthtml-richtypo");
const expressions = require("posthtml-expressions");
const removeAttributes = require("posthtml-remove-attributes");
const { quotes, sectionSigns, shortWords } = require("richtypo-rules-ru");
const uglify = require("gulp-uglify-es").default;

function browser() {
  browserSync.init({
    server: { baseDir: "dist/" },
    notify: false,
    online: true,
  });
}

function styles() {
  return src("src/scss/*.scss")
    .pipe(sass())
    .pipe(concat("app.min.css"))
    .pipe(
      autoprefixer({ overrideBrowserslist: ["last 10 versions"], grid: true })
    )
    .pipe(cleancss({ level: { 1: { specialComments: 0 } } }))
    .pipe(dest("dist/css/"))
    .pipe(browserSync.stream());
}

function media() {
  return src("src/media.scss")
    .pipe(sass())
    .pipe(concat("media.css"))
    .pipe(
      autoprefixer({ overrideBrowserslist: ["last 10 versions"], grid: true })
    )
    .pipe(cleancss({ level: { 1: { specialComments: 0 } } }))
    .pipe(dest("dist/css/"))
    .pipe(browserSync.stream());
}

function htmlProcess() {
  return src("src/**/*.html")
    .pipe(
      posthtml([
        include(),
        expressions(),
        richtypo({
          attribute: "data-typo",
          rules: [quotes, sectionSigns, shortWords],
        }),
        removeAttributes(["data-typo"]),
      ])
    )
    .pipe(dest("dist"));
}

function scripts() {
  return src("src/script.js")
    .pipe(uglify())
    .pipe(dest("dist/"))
    .pipe(browserSync.stream());
}

function imgProcess() {
  return src("src/img/*.*").pipe(imagemin()).pipe(dest("dist/img/"));
}

function fontsCopy() {
  return src("src/fonts/*.*").pipe(dest("dist/fonts/"));
}

function cssCopy() {
  return src("src/css/*.css").pipe(dest("dist/css/"));
}

function startWatch() {
  watch("src/**/*.js").on("change", series(scripts, browserSync.reload));
  watch("src/scss/*.scss").on("change", series(styles, browserSync.reload));
  watch("src/media.scss").on("change", series(media, browserSync.reload));
  watch("src/*.html").on("change", series(htmlProcess, browserSync.reload));
}

exports.browserSync = browser;
exports.scripts = scripts;
exports.styles = styles;
exports.media = media;
exports.html = htmlProcess;
exports.fonts = fontsCopy;
exports.css = cssCopy;
exports.img = imgProcess;
exports.start = parallel(
  styles,
  media,
  scripts,
  htmlProcess,
  imgProcess,
  fontsCopy,
  cssCopy,
  browser,
  startWatch
);
