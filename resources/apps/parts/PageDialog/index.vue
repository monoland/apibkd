<template>
    <v-dialog :value="state" fullscreen hide-overlay :transition="transition">
        <v-card height="100%" flat v-if="$vuetify.breakpoint.xsOnly">
            <v-toolbar color="white" flat>
                <v-btn icon @click="$emit(cancelName)">
                    <v-icon>arrow_back</v-icon>
                </v-btn>

                <v-spacer></v-spacer>
                <span class="d-block title">{{ title }}</span>
                <v-spacer></v-spacer>

                <v-btn icon :color="$root.theme" @click="$emit(submitName)">
                    <v-icon>done</v-icon>
                </v-btn>
            </v-toolbar>

            <v-container grid-list-xs>
                <v-layout wrap>
                    <slot></slot>
                </v-layout>
            </v-container>
        </v-card>

        <v-card flat :class="`${$root.theme} lighten-5`" v-else>
            <v-toolbar :color="`${$root.theme} lighten-4`" extended flat>
                <v-btn icon @click="$emit(cancelName)">
                    <v-icon>close</v-icon>
                </v-btn>
            </v-toolbar>

            <v-layout row pb-2>
                <v-flex :xs8="!small" :offset-xs2="!small" :xs6="small" :offset-xs3="small">
                    <v-widget form :title="title" :subtitle="subtitle" style="margin-top: -56px !important;">
                        <v-container class="px-0 pb-0 pt-2" grid-list-md>
                            <slot></slot>
                        </v-container>

                        <v-card-actions slot="actions">
                            <v-spacer></v-spacer>
                            <v-btn text :color="$root.theme" @click="$emit(submitName)">{{ submitName }}</v-btn>
                            <v-btn text :color="$root.theme" @click="$emit(cancelName)">{{ cancelName }}</v-btn>
                        </v-card-actions>
                    </v-widget>
                </v-flex>
            </v-layout>
        </v-card>
    </v-dialog>
</template>

<script>
export default {
    name: 'v-page-dialog',

    props: {
        submitName: {
            type: String,
            default: 'submit'
        },

        cancelName: {
            type: String,
            default: 'cancel'
        },

        title: {
            type: String,
            default: null
        },

        subtitle: {
            type: String,
            default: null
        },

        small: {
            type: Boolean,
            default: false
        },

        value: Boolean
    },

    computed: {
        transition: function() {
            if (this.$vuetify.breakpoint.xsOnly) {
                return 'dialog-move-transition';
            }

            return 'dialog-bottom-transition';
        }
    },

    data:() => ({
        state: false
    }),

    created() {
        this.state = this.value;
    },

    watch: {
        value: function(state) {
            this.state = state;
        }
    }
};
</script>