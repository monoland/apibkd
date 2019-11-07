<template>
    <v-page-wrap crud absolute searchable with-progress>
        <template #add-button>
            <v-document-upload class="v-btn static" :callback="callback"  v-show="!disabled.add">
                <v-btn icon :color="$root.theme">
                    <v-icon>add</v-icon>
                </v-btn>
            </v-document-upload>
        </template>

        <v-widget table v-if="desktop">
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

                <template v-slot:item.byte="{ value }">
                    {{ $root.formatBytes(value) }}
                </template>
            </v-data-table>
        </v-widget>

        <v-mobile-table icon="perm_identity" v-else>
            <template v-slot:default="{ item }">
                <v-list-item-content>
                    <v-list-item-title>{{ item.name }}</v-list-item-title>
                    <v-list-item-subtitle class="f-nunito">{{ item.mime }}</v-list-item-subtitle>
                </v-list-item-content>
            </template>
        </v-mobile-table>

        <v-page-form small>
            <v-row>
                <v-col cols="12">
                    <v-text-field
                        label="Nama Dokumen"
                        :color="$root.theme"
                        v-model="record.name"
                    ></v-text-field>
                </v-col>
            </v-row>
        </v-page-form>
    </v-page-wrap>
</template>

<script>
import { pageMixins } from '@apps/mixins/PageMixins';

export default {
    name: 'page-document',

    mixins: [pageMixins],

    route: [
        { path: 'document', name: 'document', root: 'monoland' },
    ],

    data:() => ({
        single: false,
    }),

    created() {
        this.tableHeaders([
            { text: 'Name', value: 'name' },
            { text: 'Ekstensi', value: 'extn' },
            { text: 'Mime', value: 'mime' },
            { text: 'Ukuran', value: 'byte', align: 'end', class: 'number-field' },
            { text: 'Updated', value: 'updated_at', class: 'datetime-field' }
        ]);

        this.pageInfo({
            icon: 'filter_none',
            title: 'Dokumen',
        });

        this.dataUrl(`/api/document`);

        this.setRecord({
            id: null,
            name: null
        });
    },

    methods: {
        callback: function(record) {
            this.$store.commit('documentPush', record);
            this.$store.dispatch('recordReload');
        }
    }
};
</script>