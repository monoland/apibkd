<template>
    <v-page-wrap crud absolute searchable with-progress>
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

                <template v-slot:item.lockicon="{ value }">
                    <v-icon>{{ value }}</v-icon>
                </template>
            </v-data-table>
        </v-widget>

        <v-mobile-table icon="whatshot" v-else>
            <template v-slot:default="{ item }">
                <v-list-item-content>
                    <v-list-item-title>{{ item.name }}</v-list-item-title>
                    <v-list-item-subtitle class="f-nunito">{{ item.secret }}</v-list-item-subtitle>
                </v-list-item-content>
            </template>
        </v-mobile-table>

        <v-page-form small>
            <v-row>
                <v-col cols="6">
                    <v-text-field
                        label="Id Klien"
                        :color="$root.theme"
                        v-model="record.id"
                        readonly
                    ></v-text-field>
                </v-col>

                <v-col cols="6">
                    <v-select v-if="form.mode === 'edit'"
                        :items="statuses"
                        label="Status"
                        :color="$root.theme"
                        v-model="record.revoked"
                    ></v-select>

                    <v-select v-else
                        :items="grants"
                        label="Grant"
                        :color="$root.theme"
                        v-model="record.grant"
                    ></v-select>
                </v-col>

                <v-col sm="12" md="6">
                    <v-text-field
                        label="Nama Klien"
                        :color="$root.theme"
                        v-model="record.name"
                    ></v-text-field>
                </v-col>

                <v-col sm="12" md="6">
                    <v-text-field
                        label="Redirect"
                        :color="$root.theme"
                        v-model="record.redirect"
                    ></v-text-field>
                </v-col>

                <v-col cols="12">
                    <v-textarea v-if="form.mode === 'edit'"
                        label="Rahasia"
                        :color="$root.theme"
                        v-model="record.secret"
                    ></v-textarea>
                </v-col>
            </v-row>
        </v-page-form>
    </v-page-wrap>
</template>

<script>
import { pageMixins } from '@apps/mixins/PageMixins';

export default {
    name: 'page-client',

    mixins: [pageMixins],

    route: [
        { path: 'client', name: 'client', root: 'monoland' },
    ],

    data:() => ({
        single: false,
        
        statuses: [
            { value: false, text: 'active' },
            { value: true, text: 'revoked' }
        ],

        grants: [
            { value: 'password', text: 'Password Grant' },
            { value: 'client', text: 'Client Grant' }
        ],
    }),

    created() {
        this.tableHeaders([
            { text: 'Nama', value: 'name' },
            { text: 'Secret', value: 'secret' },
            { text: 'Revoke', value: 'lockicon', sortable: false, align: 'center', class: 'icontag' },
            { text: 'Updated', value: 'updated_at', class: 'datetime-field' }
        ]);

        this.pageInfo({
            icon: 'whatshot',
            title: 'OAuth Klien',
        });

        this.dataUrl(`/api/client`);

        this.setRecord({
            id: null,
            name: null,
            secret: null,
            revoked: false,
            grant: null,
            redirect: null
        });
    }
};
</script>