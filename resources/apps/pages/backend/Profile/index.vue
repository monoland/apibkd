<template>
    <v-page-wrap flat absolute>
        <template #toolbar-default>
            <v-btn :color="$root.theme" icon @click="profileUpdate(user)">
                <v-icon>done</v-icon>
            </v-btn>
        </template>

        <v-container class="pa-0" fill-height>
            <v-layout justify-center wrap>
                <v-card flat :width="dynWidth">
                    <v-img :aspect-ratio="4/3" :src="$root.background">
                        <v-layout column align-center justify-center fill-height>
                            <v-media-upload media-name="profile" :callback="profileAvatar">
                                <v-avatar size="128" class="elevation-2" color="white">
                                    <v-img :src="$root.avatar"></v-img>
                                </v-avatar>
                            </v-media-upload>
                        </v-layout>

                        <div class="drawer-edit" style="position: absolute; bottom: 4px; right: 4px;">
                            <v-media-upload class="v-btn" media-name="background" :callback="profileBackground">
                                <v-btn icon>
                                    <v-icon>edit</v-icon>
                                </v-btn>
                            </v-media-upload>
                        </div>
                    </v-img>
                    
                    <v-card-text>
                        <v-row>
                            <v-col cols="12">
                                <v-text-field
                                    label="Nama Pengguna"
                                    :color="$root.theme"
                                    v-model="user.name"
                                ></v-text-field>
                            </v-col>

                            <v-col cols="12">
                                <v-text-field
                                    label="Alamat Email"
                                    :color="$root.theme"
                                    v-model="user.email"
                                ></v-text-field>
                            </v-col>

                            <v-col cols="12">
                                <v-select
                                    @change="themeUpdate"
                                    label="Warna Thema"
                                    :color="$root.theme"
                                    :items="colors"
                                    v-model="user.theme"
                                ></v-select>
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
    name: 'page-profile',

    route: [
        { path: 'profile', name: 'profile', root: 'monoland' },
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
        colors: [
            { value: 'red', text: 'Red'},
            { value: 'pink', text: 'Pink'},
            { value: 'purple', text: 'Purple'},
            { value: 'deep-purple', text: 'Deep Purple'},
            { value: 'indigo', text: 'Indigo'},
            { value: 'blue', text: 'Blue'},
            { value: 'light-blue', text: 'Light Blue'},
            { value: 'cyan', text: 'Cyan'},
            { value: 'teal', text: 'Teal'},
            { value: 'green', text: 'Green'},
            { value: 'light-green', text: 'Light Green'},
            { value: 'lime', text: 'Lemon'},
            { value: 'yellow', text: 'Yellow'},
            { value: 'amber', text: 'Amber'},
            { value: 'orange', text: 'Orange'},
            { value: 'deep-orange', text: 'Deep Orange'},
            { value: 'brown', text: 'Brown'},
            { value: 'blue-grey', text: 'Blue Grey'},
            { value: 'grey', text: 'Grey'},
        ],

        user: {}
    }),

    created() {
        this.initStore();
        
        this.user = {
            name: this.auth.user.name,
            email: this.auth.user.email,
            theme: this.auth.theme
        };

        this.pageInfo({
            icon: 'perm_identity',
            title: 'Profile',
        });
    },

    mounted() {
        this.$store.subscribe((mutation) => {
            if (mutation.type === 'auth') {
                if (mutation.payload.hasOwnProperty('avatar')) {
                    this.$root.avatar = mutation.payload.avatar;
                } else if (mutation.payload.hasOwnProperty('background')) {
                    this.$root.background = mutation.payload.background;
                }
            }
        });
    },

    methods: {
        ...mapActions([
            'initStore', 'profileAvatar', 'profileBackground', 'profileUpdate', 'pageInfo'
        ]),

        themeUpdate: function(value) {
            this.$root.theme = value;
        }
    }
};
</script>