<template>
    <v-widget table>
        <v-data-table
            v-model="table.selected"
            :headers="headers"
            :items="records"
            :single-select="single"
            :loading="table.loader"
            :options.sync="table.options"
            :server-items-length="table.total"
            :footer-props="table.footerProps"
            item-key="id"
            show-select
        >
            <template #:progress>
                <v-progress-linear :color="color" height="1" indeterminate></v-progress-linear>
            </template>
        </v-data-table>
    </v-widget>
</template>

<script>
import { mapState } from 'vuex';

export default {
    name: 'v-desktop-table',

    props: {
        color: {
            type: String,
            default: function() {
                return this.$root.theme;
            }
        },

        single: {
            type: Boolean,
            default: false
        }
    },

    computed: {
        ...mapState([
            'table', 'headers', 'records'
        ]),
    }
}
</script>
