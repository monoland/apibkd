const mix = require('laravel-mix');

mix.webpackConfig({
    resolve: {
        extensions: ['.js', '.vue'],
        alias: {
            '@apps': __dirname + '/resources/apps'
        }
    }
});

mix.js('resources/apps/index.js', 'public/scripts/monoland.js')
mix.stylus('resources/design/main.styl', 'public/styles/monoland.css');

mix.extract(['vue', 'vue-router', 'vuex', 'vuetify']);