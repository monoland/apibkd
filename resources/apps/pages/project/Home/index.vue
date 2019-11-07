<template>
    <v-page-wrap no-trash>
        <!--  -->
    </v-page-wrap>
</template>

<script>
import { mapActions } from 'vuex';

export default {
    name: 'page-home',

    route: [
        { path: 'home', name: 'home', root: 'monoland' },
    ],

    created() {
        this.initStore();
        
        this.pageInfo({
            icon: 'home',
            title: 'Beranda',
        });
    },

    data:() => ({
        // 
    }),

    methods: {
        ...mapActions(['pageInfo', 'initStore']),
    }
};
</script>
