## Quick Browser Prototyping using Handlebars, Postcss, Rollup and Lite-server

----

Lite-server is used as a development server hosting files inside the /dist/ folder. 

1. Clone repository.
2. `npm i`
3. `npm start`
4. Open localhost:3000 in the browser and observe changes.

### Css

Edit Css files inside /src/css/ and they will be transformed to /dist/css/.

Css updates are injected and does not initiate a full browser reload.

All future CSS features will be polyfilled(stage 0) and Sass like features are included(mixins and variables).

### JS

Edit JS files inside /src/js/ and they will be transformed to /dist/js/.

Javascript is bundled using Rollup and Babel.

### HTML

Html is processed with handlebarjs and fabricator-assemble to bundle. See /src/components/ for sample html which is used in /src/views/index.html.

See  https://github.com/fbrctr/fabricator-assemble#usage-1 for a more detailed explanation.