<template>
    <v-page-wrap flat absolute>
        <template #toolbar-default>
            <v-btn :color="$root.theme" icon @click="passwordUpdate(user)">
                <v-icon>done</v-icon>
            </v-btn>
        </template>

        <v-container class="pa-0" fill-height>
            <v-layout justify-center wrap>
                <v-card flat :width="dynWidth">
                    <v-img :aspect-ratio="4/3" :src="$root.background">
                        <v-layout column align-center justify-center fill-height>
                            <v-avatar size="128" class="elevation-2" color="white">
                                <v-img :src="$root.avatar"></v-img>
                            </v-avatar>
                        </v-layout>
                    </v-img>
                    
                    <v-card-text>
                        <v-row>
                            <v-col cols="12">
                                <v-text-field 
                                    label="Katasandi Lama"
                                    :color="$root.theme"
                                    v-model="user.old_password"
                                    :append-icon="hidden1 ? 'visibility_off' : 'visibility'"
                                    :type="hidden1 ? 'password' : 'text'"
                                    @click:append="hidden1 = !hidden1"
                                ></v-text-field>
                            </v-col>

                            <v-col cols="12">
                                <v-text-field 
                                    label="Katasandi Baru"
                                    :color="$root.theme"
                                    v-model="user.password"
                                    :append-icon="hidden2 ? 'visibility_off' : 'visibility'"
                                    :type="hidden2 ? 'password' : 'text'"
                                    @click:append="hidden2 = !hidden2"
                                ></v-text-field>
                            </v-col>

                            <v-col cols="12">
                                <v-text-field 
                                    label="Konfirmasi Sandi"
                                    :color="$root.theme"
                                    v-model="user.password_confirmation"
                                    :append-icon="hidden3 ? 'visibility_off' : 'visibility'"
                                    :type="hidden3 ? 'password' : 'text'"
                                    @click:append="hidden3 = !hidden3"
                                ></v-text-field>
                            </v-col>
                        </v-row>
                    </v-card-text>
                </v-card>
            </v-layout>
        </v-container>
    </v-page-wrap>
</template>

<script>
import { mapState, mapActions } from 'vuex';

export default {
    name: 'page-password',

    route: [
        { path: 'password', name: 'password', root: 'monoland' },
    ],

    computed: {
        ...mapState(['auth']),

        dynWidth: function() {
            if (this.$vuetify.breakpoint.xsOnly) {
                return '100%';
            }

            return '360px';
        },
    },

    data:() => ({
        user: {
            old_password: null,
            password: null,
            password_confirmation: null
        },

        hidden1: true,
        hidden2: true,
        hidden3: true
    }),

    created() {
        this.initStore();
        
        this.pageInfo({
            icon: 'lock',
            title: 'Password',
        });
    },

    methods: {
        ...mapActions([
            'initStore', 'passwordUpdate', 'pageInfo'
        ])
    }
};
</script>