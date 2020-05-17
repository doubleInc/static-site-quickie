//
const { src, dest, series, parallel, watch } = require("gulp");
const postcss = require("gulp-postcss");
const postcssPresetEnv = require("postcss-preset-env");
const assemble = require("fabricator-assemble");
const run = require("gulp-run-command").default;

// CSS task
function css() {
  return src("./src/css/**/*.css")
    .pipe(
      postcss([
        require("postcss-mixins"),
        require("postcss-advanced-variables"),
        postcssPresetEnv({
          // browserlist in package.json
          stage: 0,
        }),
      ])
    )
    .pipe(dest("./dist/css/"));
}

function html(done) {
  assemble({
    layout: "default",
    layouts: "src/views/layouts/*",
    layoutIncludes: "src/views/layouts/includes/*",
    views: ["src/views/**/*", "!src/views/+(layouts)/**"],
    materials: "src/components/**/*",
    data: "src/data/**/*.{json,yml}",
    docs: "src/docs/**/*.md",
    keys: {
      materials: "materials",
      views: "views",
      docs: "docs",
    },
    helpers: {},
    logErrors: false,
    onError: function (error) {},
    dest: "dist",
    baseUrl: "",
  });
  done();
}

// Watch files
function watchFiles() {
  watch("./src/css/**/*.css", css);
  watch("./src/**/*.html", html);
}

const build = series(css, html);
const watchTask = parallel(watchFiles, run("lite-server"));

exports.default = series(build, watchTask);
