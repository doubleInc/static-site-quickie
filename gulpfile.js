// dependencies
const { src, dest, series, parallel, watch } = require("gulp");
const postcss = require("gulp-postcss");
const postcssPresetEnv = require("postcss-preset-env");
const assemble = require("fabricator-assemble");
const rollup = require("rollup");
const run = require("gulp-run-command").default;
const resolve = require("@rollup/plugin-node-resolve");
const commonjs = require("@rollup/plugin-commonjs");
const { babel } = require("@rollup/plugin-babel");
const { terser } = require("rollup-plugin-terser");

// `npm run build` -> `production` is true
// `npm run dev` -> `production` is false
const production = !process.env.ROLLUP_WATCH;

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

// rollup JS for browser output
async function scripts(done) {
  const bundle = await rollup.rollup({
    input: "src/js/main.js",
    plugins: [
      resolve(), // tells Rollup how to find date-fns in node_modules
      babel({
        babelHelpers: "bundled", // include babel helpers in bundle
        exclude: "node_modules/**", // only transpile our source code
      }),
      commonjs(),
      production && terser(), // minify, but only in production
    ],
  });

  await bundle.write({
    file: "dist/js/bundle.js",
    format: "cjs", // or iife
    sourcemap: true,
  });
  done();
}

// fabricator handlebars builder
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
  watch("./src/**/*.css", css);
  watch("./src/**/*.html", html);
  watch("./src/**/*.js", scripts);
}

const build = series(css, html, scripts);
const watchTask = parallel(watchFiles, run("lite-server"));

exports.default = series(build, watchTask);
