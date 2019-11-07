<template>
    <v-dialog v-model="form.state" fullscreen hide-overlay :transition="transition">
        <v-card height="100%" flat v-if="$vuetify.breakpoint.xsOnly">
            <v-toolbar color="white" flat>
                <v-btn icon @click="formClose">
                    <v-icon>arrow_back</v-icon>
                </v-btn>

                <v-spacer></v-spacer>
                <span class="d-block title">{{ page.title }}</span>
                <v-spacer></v-spacer>

                <v-btn icon :color="$root.theme" @click="formSubmit">
                    <v-icon>done</v-icon>
                </v-btn>
            </v-toolbar>

            <v-container grid-list-xs>
                <slot></slot>
            </v-container>
        </v-card>

        <v-card flat :class="`${$root.theme} lighten-5`" v-else>
            <v-toolbar :color="`${$root.theme} lighten-4`" extended flat>
                <v-btn icon @click="formClose">
                    <v-icon>close</v-icon>
                </v-btn>
            </v-toolbar>

            <v-layout row pb-2>
                <v-flex :xs8="!small" :offset-xs2="!small" :xs6="small" :offset-xs3="small">
                    <v-widget form style="margin-top: -56px !important;">
                        <v-container class="px-0 pb-0 pt-2" grid-list-md>
                            <slot></slot>
                        </v-container>

                        <v-card-actions slot="actions">
                            <v-spacer></v-spacer>
                            <v-btn text :color="$root.theme" @click="formSubmit">{{ submitName }}</v-btn>
                            <v-btn text :color="$root.theme" @click="formClose">{{ cancelName }}</v-btn>
                        </v-card-actions>
                    </v-widget>
                </v-flex>
            </v-layout>
        </v-card>
    </v-dialog>
</template>

<script>
import { mapState, mapActions } from 'vuex';

export default {
    name: 'v-page-form',

    props: {
        submitName: {
            type: String,
            default: 'submit'
        },

        cancelName: {
            type: String,
            default: 'cancel'
        },

        small: {
            type: Boolean,
            default: false
        }
    },

    computed: {
        ...mapState(['form', 'page']),

        transition: function() {
            if (this.$vuetify.breakpoint.xsOnly) {
                return 'dialog-move-transition';
            }

            return 'dialog-bottom-transition';
        }
    },

    methods: {
        ...mapActions(['formClose', 'formSubmit'])
    },
};
</script>