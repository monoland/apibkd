<template>
    <v-app v-cloak>
        <v-apps-menu></v-apps-menu>
        
        <v-content :class="`${$root.theme} lighten-5`">
            <v-card height="100%" color="transparent" flat v-if="$vuetify.breakpoint.xsOnly">
                <router-view :key="$route.path"></router-view>

                <v-bottom-navigation 
                    grow absolute shift
                >
                    <template v-for="(menu, index) in menus.homebar">
                        <v-btn text :color="$root.theme" :to="menu.to" :key="index">
                            <span>{{ menu.text }}</span>
                            <v-icon>{{ menu.icon }}</v-icon>
                        </v-btn>
                    </template>

                    <v-btn text :color="$root.theme" @click="signout">
                        <span>Signout</span>
                        <v-icon>exit_to_app</v-icon>
                    </v-btn>
                </v-bottom-navigation>
            </v-card>

            <router-view :key="$route.path" v-else></router-view>
        </v-content>

        <v-snackbar
            v-model="snackbar.state"
            :color="snackbar.color"
        >
            {{ snackbar.text }}
            <v-btn dark text @click="snackbarClose">Tutup</v-btn>
        </v-snackbar>

        <v-file-browser></v-file-browser>
    </v-app>
</template>

<script>
import { mapState, mapActions } from 'vuex';

export default {
    name: 'page-base',

    route: [
        { path: '/backend', node: 'monoland', meta: { auth: true }, children: [] },
        { path: '', name: 'landing', redirect: { name: 'home' }, root: 'monoland' },
    ],

    computed: {
        ...mapState(['auth', 'menus', 'snackbar']),
    },

    created() {
        if (!this.$root.theme) {
            this.$root.theme = this.auth.theme;
            this.$root.avatar = this.auth.avatar;
            this.$root.background = this.auth.background;
        }
    },

    methods: {
        ...mapActions(['snackbarClose', 'signout'])
    }
};
</script>