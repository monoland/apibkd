<template>
    <v-app v-cloak>
        <template v-if="$vuetify.breakpoint.xsOnly">
            <v-card flat class="mx-auto" width="100%" height="100%">
                <v-img class="v-background__auth grey lighten-4" :src="company.background" :aspect-ratio="4/3">
                    <div class="d-flex flex-column fill-height">
                        <div class="d-flex align-end justify-center px-6" style="flex: 1 1 auto;">
                            <v-img :src="company.logo" :style="backgroundWidth"></v-img>
                        </div>
                        <div class="d-flex align-end justify-center font-size-zero px-6 py-4" v-html="company.name"></div>
                    </div>
                </v-img>

                <v-card-text class="px-6">
                    <v-row no-gutters>
                        <v-col cols="12">
                            <v-text-field
                                color="cyan"
                                label="Username"
                                prepend-inner-icon="mail_outline"
                                v-model="login.username"
                                autocomplete="off"
                                hide-details
                                single-line
                            ></v-text-field>
                        </v-col>

                        <v-col class="mt-4" cols="12">
                            <v-text-field 
                                @click:append="showtext = !showtext"
                                :append-icon="showtext ? 'visibility' : 'visibility_off'"
                                :type="showtext ? 'text' : 'password'"
                                color="cyan"
                                label="Password"
                                prepend-inner-icon="lock_open"
                                v-model="login.userpass"
                                autocomplete="off"
                                hide-details
                                single-line
                            ></v-text-field>
                        </v-col>
                    </v-row>
                </v-card-text>

                <v-card-text class="px-6">
                    <v-row no-gutters>
                        <v-col cols="12">
                            <v-btn color="cyan" block depressed rounded large dark @click="signin">login to app</v-btn>
                        </v-col>
                    </v-row>
                </v-card-text>
            </v-card>
        </template>

        <template v-else>
            <v-app-bar class="transparent elevation-0" app>
                <v-container>
                    <v-toolbar-title class="font-size-zero" v-html="company.name"></v-toolbar-title>
                </v-container>
            </v-app-bar>

            <v-content class="v-background__auth" :style="backgroundStyle">
                <v-container class="fill-height">
                    <v-row>
                        <v-col class="d-flex align-center" cols="6">
                            <v-card class="transparent" elevation="0">
                                <div class="d-block mb-6" :style="backgroundWidth" v-if="company.logo">
                                    <v-img :src="company.logo"></v-img>
                                </div>

                                <div class="d-block" v-html="company.title"></div>
                                <v-card-text class="pa-0 mt-6" v-html="company.quote"></v-card-text>
                            </v-card>
                        </v-col>

                        <v-col class="d-flex align-center justify-end" cols="6">
                            <v-card class="v-card--widget mt-4" elevation="1" width="360px">
                                <v-sheet color="cyan" class="v-sheet--offset pa-4 mx-auto elevation-0" max-width="calc(100% - 32px)">
                                    <span class="d-block text-uppercase font-weight-medium text-xs-center line-height-1 white--text">l o g i n</span>
                                    <span class="d-block headline font-weight-light letter-space-1 text-uppercase text-xs-center mt-2 line-height-1 white--text">authentication</span>
                                </v-sheet>
                                
                                <v-card-text>
                                    <v-row no-gutters>
                                        <v-col cols="12">
                                            <v-text-field
                                                color="cyan"
                                                label="Username"
                                                prepend-inner-icon="mail_outline"
                                                v-model="login.username"
                                                autocomplete="off"
                                                hide-details
                                                single-line
                                            ></v-text-field>
                                        </v-col>

                                        <v-col class="mt-4" cols="12">
                                            <v-text-field 
                                                @click:append="showtext = !showtext"
                                                :append-icon="showtext ? 'visibility' : 'visibility_off'"
                                                :type="showtext ? 'text' : 'password'"
                                                color="cyan"
                                                label="Password"
                                                prepend-inner-icon="lock_open"
                                                v-model="login.userpass"
                                                autocomplete="off"
                                                hide-details
                                                single-line
                                            ></v-text-field>
                                        </v-col>
                                    </v-row>
                                </v-card-text>

                                <v-card-text>
                                    <v-row no-gutters>
                                        <v-col cols="12">
                                            <v-btn color="cyan" block depressed rounded large dark @click="signin">login to app</v-btn>
                                        </v-col>
                                    </v-row>
                                </v-card-text>
                            </v-card>
                        </v-col>
                    </v-row>
                </v-container>
            </v-content>
        </template>

        <v-snackbar
            v-model="snackbar.state"
            :color="snackbar.color"
        >
            {{ snackbar.text }}
            <v-btn dark text @click="snackbarClose">Tutup</v-btn>
        </v-snackbar>
    </v-app>
</template>

<script>
import { mapState, mapActions } from 'vuex';

export default {
    name: 'page-login',

    route: [
        { path: '/', name: 'login' },
        { path: '*', name: null, redirect: { name: 'login' } },
    ],

    computed: {
        ...mapState(['company', 'login', 'snackbar']),

        backgroundStyle: function() {
            if (this.company && this.company.background && !this.$vuetify.breakpoint.xsOnly) {
                return `background: url(${this.company.background}); background-position: center; background-repeat: no-repeat; background-size: cover;`;
            }

            return null;
        },

        backgroundWidth: function() {
            if (this.company && this.company.width) {
                return `max-width: ${this.company.width};`;
            }

            return null;
        }
    },

    data:() => ({
        showtext: false
    }),

    created() {
        this.initStore();
    },

    mounted() {
        this.fetchAppInfos();
    },

    methods: {
        ...mapActions(['initStore', 'snackbarClose', 'fetchAppInfos', 'signin'])
    }
};
</script>