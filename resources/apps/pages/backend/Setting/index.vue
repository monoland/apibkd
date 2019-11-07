<template>
    <v-page-wrap flat absolute>
        <template #toolbar-default>
            <v-btn :color="$root.theme" icon @click="settingUpdate(record)">
                <v-icon>done</v-icon>
            </v-btn>
        </template>

        <v-container class="pa-0" fill-height>
            <v-layout justify-center wrap>
                <v-card flat :width="dynWidth">
                    <v-img :aspect-ratio="4/3" :src="record.background ? record.background : ''">
                        <v-layout :class="{ 'grey': record.background === '' }" column align-center justify-center fill-height>
                            <v-media-upload media-name="app-logo" :callback="settingAvatar">
                                <v-avatar size="128" class="elevation-2" color="white">
                                    <v-img :src="record.logo ? record.logo : ''"></v-img>
                                </v-avatar>
                            </v-media-upload>
                        </v-layout>

                        <div class="drawer-edit" style="position: absolute; bottom: 4px; right: 4px;">
                            <v-media-upload class="v-btn" media-name="app-background" :callback="settingBackground">
                                <v-btn icon>
                                    <v-icon>edit</v-icon>
                                </v-btn>
                            </v-media-upload>
                        </div>
                    </v-img>
                    
                    <v-card-text>
                        <v-row>
                            <v-col cols="12">
                                <v-textarea
                                    label="Nama Perusahaan"
                                    :color="$root.theme"
                                    v-model="record.name"
                                ></v-textarea>
                            </v-col>

                            <v-col cols="12">
                                <v-textarea
                                    label="Judul"
                                    :color="$root.theme"
                                    v-model="record.title"
                                ></v-textarea>
                            </v-col>

                            <v-col cols="12">
                                <v-textarea
                                    label="Quote"
                                    :color="$root.theme"
                                    v-model="record.quote"
                                ></v-textarea>
                            </v-col>

                            <v-col cols="6">
                                <v-text-field
                                    label="Tinggi"
                                    :color="$root.theme"
                                    v-model="record.height"
                                ></v-text-field>
                            </v-col>

                            <v-col cols="6">
                                <v-text-field
                                    label="Lebar"
                                    :color="$root.theme"
                                    v-model="record.width"
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
    name: 'page-setting',

    route: [
        { path: 'setting', name: 'setting', root: 'monoland' },
    ],

    computed: {
        ...mapState(['record']),

        dynWidth: function() {
            if (this.$vuetify.breakpoint.xsOnly) {
                return '100%';
            }

            return '360px';
        },
    },

    created() {
        this.initStore();
        
        this.pageInfo({
            icon: 'settings',
            title: 'Setting',
        });

        this.settingFetch();
    },

    methods: {
        ...mapActions([
            'initStore', 'settingAvatar', 'settingBackground', 
            'settingFetch', 'settingUpdate', 'pageInfo'
        ])
    }
};
</script>