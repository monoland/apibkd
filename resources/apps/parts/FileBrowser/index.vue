<template>
    <v-dialog persistent width="800" v-model="document.state">
        <v-card class="v-filebrowser">
            <v-toolbar :color="$root.theme" dark flat>
                <v-toolbar-title>File Browser</v-toolbar-title>
                
                <v-spacer></v-spacer>
                
                <div class="v-filebrowser__actions">
                    <v-scale-transition>
                        <v-btn icon @click="searchOpen" v-if="tab === 'files' && !editState">
                            <v-icon>search</v-icon>
                        </v-btn>
                    </v-scale-transition>

                    <v-scale-transition>
                        <v-btn icon @click="editOpen" v-if="tab === 'files' && editState">
                            <v-icon>edit</v-icon>
                        </v-btn>
                    </v-scale-transition>
                </div>
                
                <v-btn icon @click="close">
                    <v-icon>close</v-icon>
                </v-btn>

                <template v-slot:extension>
                    <v-tabs class="px-4" background-color="transparent" v-model="tab">
                        <v-tabs-slider color="white"></v-tabs-slider>
                        
                        <v-tab href="#upload">unggah</v-tab>
                        <v-tab href="#files">files</v-tab>
                    </v-tabs>

                    <v-fade-transition>
                        <div class="v-filebrowser__extension" :class="$root.theme" v-show="searchMode">
                            <div class="v-filebrowser__search">
                                <v-slide-x-transition>
                                    <v-text-field v-if="searchMode"
                                        ref="searchField"
                                        append-icon="cancel"
                                        @click:append="searchClose"
                                        v-model="searchText"
                                        label="Cari Dokumen"
                                        hide-details
                                        single-line
                                    ></v-text-field>
                                </v-slide-x-transition>
                            </div>
                        </div>
                    </v-fade-transition>

                    <v-fade-transition>
                        <div class="v-filebrowser__extension" :class="$root.theme" v-show="editMode">
                            <div class="v-filebrowser__search">
                                <v-slide-x-transition>
                                    <v-text-field v-if="editMode"
                                        ref="editField"
                                        append-icon="cancel"
                                        append-outer-icon="done"
                                        @click:append="editMode = false"
                                        @click:append-outer="editSubmit"
                                        v-model="editObject.name"
                                        label="Nama Dokumen"
                                        hide-details
                                        single-line
                                    ></v-text-field>
                                </v-slide-x-transition>
                            </div>
                        </div>
                    </v-fade-transition>
                </template>
            </v-toolbar>

            <v-card-text class="v-filebrowser__wrap pa-0">
                <v-slide-x-transition mode="in-out">
                    <div class="v-filebrowser__content" v-show="tab === 'upload'">
                        <v-layout class="lightbox" :class="`${$root.theme}--text`" fill-height align-center justify-center>
                            <v-document-upload :callback="callback">
                                <v-btn depressed :color="$root.theme" dark>
                                    unggah file
                                </v-btn>

                                <v-progress-linear
                                    :active="upload.progress"
                                    :indeterminate="upload.combined"
                                    :value="upload.value"
                                    absolute
                                    bottom
                                    color="yellow"
                                ></v-progress-linear>
                            </v-document-upload>
                        </v-layout>
                    </div>
                </v-slide-x-transition>

                <v-slide-x-reverse-transition mode="in-out">
                    <div class="v-filebrowser__content pa-0" v-show="tab === 'files'">
                        <v-data-table
                            v-model="document.selected"
                            :headers="headers"
                            :items.sync="records"
                            :single-select="!document.multiple"
                            :loading="loader"
                            :options.sync="options"
                            :server-items-length="total"
                            :footer-props="footerProps"
                            item-key="id"
                            fixed-header
                            show-select
                            height="288px"
                        >
                            <template #:progress>
                                <v-progress-linear :color="color" height="1" indeterminate></v-progress-linear>
                            </template>

                            <template v-slot:item.byte="{ value }">
                                {{ $root.formatBytes(value) }}
                            </template>
                        </v-data-table>
                    </div>
                </v-slide-x-reverse-transition>
            </v-card-text>

            <div class="v-filebrowser__foot">
                <v-btn 
                    :color="$root.theme" 
                    :disabled="tab === 'upload' || document.selected.length === 0 || editMode" 
                    :dark="tab === 'files' && document.selected.length !== 0 && !editMode"
                    depressed
                    @click="onSelect"
                >select</v-btn>
            </div>
        </v-card>
    </v-dialog>
</template>

<script>
import { debounce } from 'debounce';
import { mapState, mapActions } from 'vuex';

export default {
    name: 'v-file-browser',

    computed: {
        ...mapState(['document', 'http', 'upload'])
    },

    data:() => ({
        editMode: false,
        editState: false,
        editObject: {},
        footerProps: { 'items-per-page-options': [5, 10, 20] },
        headers: [
            { text: 'Name', value: 'name' },
            { text: 'Ektensi', value: 'extn', align: 'center', class: 'medium-field' },
            { text: 'Mime', value: 'mime', class: 'mime-field' },
            { text: 'Ukuran', value: 'byte', align: 'end', class: 'medium-field' }
        ],
        initial: true,
        loader: false,
        options: { itemsPerPage: 5, page: 1 },
        params: { itemsPerPage: 5, page: 1, sortBy: null, sortDesc: null },
        total: 0,
        records: [],
        searchMode: false,
        searchText: null,
        selected: [],
        tab: 'upload',
    }),

    methods: {
        ...mapActions(['documentClose']),

        bouncing: debounce(function (value) {
            this.params['search'] = value;
            this.documentFetch();
        }, 1000),

        callback: function(record) {
            this.records.push(record);

            if (this.records.length === 1) this.documentFetch();

            this.tab = 'files';
        },

        close: function() {
            this.documentClose();
            this.tab = 'upload';
        },

        documentFetch: async function() {
            try {
                let { data: { data, meta }} = await this.http.get( 
                    '/api/document', { params: this.params }
                );

                this.records = data;
                this.total = meta.total;
                this.selected = [];
                this.initial = false;
            } catch (error) {
                this.$store.dispatch('errors', error);
            }
        },

        editOpen: function() {
            this.editMode = true;
            this.$nextTick(() => this.$refs.editField.$el.getElementsByTagName('input')[0].focus());
        },

        editSubmit: async function() {
            try {
                await this.http.put(
                    'api/document' + '/' + this.editObject.id, this.editObject
                );
                
                this.editMode = false;    
                
                this.$store.dispatch('message', 'proses update berhasil!');
            } catch (error) {
                this.$store.dispatch('errors', error);
            }
            
        },

        onSelect: function() {
            this.document.callback(Object.assign([], this.document.selected));
            this.documentClose();
            
            this.$nextTick(() => { 
                this.editMode = false;
                this.searchMode = false;
                this.searchText = null;
                this.editObject = {};
                this.tab = 'upload';
            });
        },

        searchClose: function() {
            this.searchMode = false;
            this.searchText = null;
        },

        searchOpen: function() {
            this.searchMode = true;
            this.$nextTick(() => this.$refs.searchField.$el.getElementsByTagName('input')[0].focus());
        }
    },

    watch: {
        'document.state': function(newVal) {
            if (newVal && newVal === true && this.records.length === 0) this.documentFetch();
        },

        'document.selected': {
            handler: function(newVal, oldVal) {
                if (oldVal.length === 0 && newVal.length === 1) {
                    this.editObject = this.document.selected[0];
                    this.editState = true;
                } else if (oldVal.length === 1 && newVal.length === 0) {
                    this.editState = false;
                    this.editMode = false;
                    this.editObject = {};
                }
            },

            deep: true
        },

        options: {
            handler: function(newVal) {
                if (this.initial) return;

                this.params = {
                    itemsPerPage: newVal.itemsPerPage, 
                    page: newVal.page, 
                    sortBy: newVal.sortBy[0], 
                    sortDesc: newVal.sortDesc[0]
                };

                this.documentFetch();
            },

            deep: true
        },

        searchText: function(newVal) {
            this.bouncing(newVal);
        },
    }
};
</script>