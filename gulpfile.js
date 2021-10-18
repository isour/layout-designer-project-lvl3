const { src, dest, parallel, watch } = require("gulp");
const sass = require("gulp-sass")(require("sass"));
const concat = require("gulp-concat");
const pug = require("gulp-pug");
const browserSync = require("browser-sync").create();
const svgSprite = require("gulp-svg-sprite");

const bsync = () => {
  browserSync.init({
    server: { baseDir: "./dist/" },
    online: true,
  });
};

// Перенос скриптов из node_modules в директорию dist/js
const scripts = () => {
  return src([
    "./node_modules/jquery/dist/jquery.min.js",
    // Здесь остальные скрипты
  ]).pipe(dest("./dist/js/"));
};

// Компиляция SASS в единый CSS файл
const sass2css = () => {
  return src([
    "app/scss/app.scss",
    // Путь к главному файлу scss, который будет компилироваться
  ])
    .pipe(sass())
    .pipe(concat("app.css"))
    .pipe(dest("./dist/styles/"));

  // Обработка через плагин sass, указание конечного файла и его месторасположение
};

// Компиляция Pug. Принцип работы такой же, как и у компиляции SASS
const pug2html = () => {
  return src(["app/pages/index.pug", "app/pages/chat.pug"])
    .pipe(pug())
    .pipe(dest("./dist/"));
};

// Создание svg спрайта из иконок
const svg2sprite = () => {
  const config = {
    mode: {
      stack: {
        // Activate the «css» mode
        sprite: "../sprite.svg",
      },
    },
  };

  return src(["./app/images/icons/*.svg"])
    .pipe(svgSprite(config))
    .pipe(dest("./dist/images/icons/"));
};

const build = (done) => {
  pug2html();
  svg2sprite();
  scripts();
  sass2css();
  cp();
  cpFonts();
  done();
};

const watchDefaulConf = {
  delay: 0,
  usePolling: true,
};

const wwatch = () => {
  watch(["app/**/*.js"], watchDefaulConf, scripts);
  watch(["app/**/*.scss"], watchDefaulConf, sass2css);
  watch(["app/**/*.pug"], watchDefaulConf, pug2html);
  watch(["app/images/icons/*.*"], watchDefaulConf, svg2sprite);
  watch(["app/images/*.jpg", "app/images/*.png"], watchDefaulConf, cp);
  watch(["app/fonts/**/*.*"], watchDefaulConf, cpFonts);
};

const cp = (done) =>
  src(["app/images/*.jpg", "app/images/*.png"]).pipe(dest("./dist/images/"));

const cpFonts = (done) => src(["app/fonts/**/*.*"]).pipe(dest("./dist/fonts/"));

exports.build = build;

exports.default = parallel(build, bsync, wwatch);
