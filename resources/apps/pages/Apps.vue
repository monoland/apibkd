<template>
    <div class="monoland" :v-cloak="!fontLoaded">
        <router-view></router-view>
    </div>
</template>

<script>
import WebFontLoader from 'webfontloader';

export default {
    name: 'mono-apps',

    data:() => ({
        fontLoaded: false,
    }),

    mounted() {
        WebFontLoader.load({
            custom: {
                families: ['Roboto', 'Nunito', 'Ubuntu Mono', 'Material Icons'],
                urls: ['/fonts/webfont.min.css']
            },
            active: this.setFontLoaded
        })
    },

    methods: {
        setFontLoaded: function() {
            this.$nextTick(() => {
                this.fontLoaded = true;
            });
        }
    }
};
</script>