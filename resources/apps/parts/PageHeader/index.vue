<template>
    <div class="v-page__header" :class="{ 'absolute': absolute, 'flat': flat, 'mobile': $vuetify.breakpoint.xsOnly }">
        <v-slide-x-reverse-transition>
            <div class="v-page__header--search" key="search" v-show="toolbar.search">
                <v-toolbar class="no-shadow" flat>
                    <v-slide-x-reverse-transition>
                        <input v-show="toolbar.search"
                            v-model="searchText"
                            ref="input"
                            class="headline font-weight-light" 
                            type="text"
                            key="text-search" 
                            placeholder="Search"
                        >
                    </v-slide-x-reverse-transition>

                    <v-scale-transition>
                        <v-btn icon key="close-search" :color="$root.theme" @click="searchClose" v-show="toolbar.search">
                            <v-icon>close</v-icon>
                        </v-btn>
                    </v-scale-transition>
                </v-toolbar>
            </div>
        </v-slide-x-reverse-transition>
        
        <v-fade-transition>
            <div class="v-page__header--delete" key="deleted" v-show="toolbar.delete">
                <v-toolbar class="no-shadow" flat>
                    <v-scale-transition>
                        <v-btn key="close" icon :color="$root.theme" @click="trashFormClose" v-show="toolbar.delete">
                            <v-icon>close</v-icon>
                        </v-btn>
                    </v-scale-transition>

                    <v-slide-x-reverse-transition>
                        <v-toolbar-title key="title" v-show="toolbar.delete">{{ `${table.selected.length}` }} <span class="d-inline-block ml-2">Selected</span> </v-toolbar-title>
                    </v-slide-x-reverse-transition>
                    
                    <v-spacer></v-spacer>

                    <v-scale-transition>
                        <v-btn key="trash" icon :color="$root.theme" @click="trashFormOpen" v-show="toolbar.delete">
                            <v-icon>delete</v-icon>
                        </v-btn>
                    </v-scale-transition>
                </v-toolbar>
            </div>
        </v-fade-transition>

        <v-toolbar flat>
            <slot name="navigate">
                <v-btn icon @click="$root.navdrawer = !$root.navdrawer">
                    <v-icon>menu</v-icon>
                </v-btn>
            </slot>

            <v-toolbar-title>{{ page.title }}</v-toolbar-title>

            <v-progress-linear v-if="withProgress"
                :active="upload.progress"
                :indeterminate="upload.combined"
                :color="$root.theme"
                :value="upload.value"
                absolute
                bottom
            ></v-progress-linear>

            <v-spacer></v-spacer>

            <template v-if="!$vuetify.breakpoint.xsOnly && crud">
                <div class="v-page__header--actions" :class="{ 'selected': selected }">
                    <v-scale-transition>
                        <slot name="add-button">
                            <v-btn-tips sticky @click="newFormOpen" label="ADDNEW" icon="add" :show="!disabled.add" />
                        </slot>
                    </v-scale-transition>
                    
                    <slot></slot>

                    <v-scale-transition>
                        <v-btn-tips @click="editFormOpen" label="EDIT" icon="edit" :show="!disabled.edit" />
                    </v-scale-transition>

                    <v-scale-transition>
                        <v-btn-tips @click="trashFormOpen" label="DELETE" icon="delete" :show="!disabled.delete" />
                    </v-scale-transition>

                    <v-scale-transition>
                        <v-btn-tips @click="recordReload" label="REFRESH" icon="refresh" :show="!disabled.refresh" />
                    </v-scale-transition>
                </div>
            </template>

            <template v-else-if="!$vuetify.breakpoint.xsOnly && !crud">
                <slot></slot>
            </template>

            <template v-else-if="$vuetify.breakpoint.xsOnly && crud">
                <slot name="add-button">
                    <v-btn icon key="newMobile" :color="$root.theme" @click="newFormOpen" v-show="!disabled.add">
                        <v-icon>add</v-icon>
                    </v-btn>
                </slot>
                
                <slot></slot>
            </template>

            <template v-else-if="$vuetify.breakpoint.xsOnly && !crud">
                <slot></slot>
            </template>

            <v-btn icon :color="$root.theme" @click="searchOpen" v-if="searchable">
                <v-icon>search</v-icon>
            </v-btn>
        </v-toolbar>
    </div>
</template>

<script>
import { debounce } from 'debounce';
import { mapState, mapActions } from 'vuex';

export default {
    name: 'v-page-header',

    props: {
        absolute: {
            type: Boolean,
            default: false
        },

        crud: {
            type: Boolean,
            default: false
        },

        enableDelete: {
            type: Boolean,
            default: true
        },

        enableEdit: {
            type: Boolean,
            default: true
        },

        flat: {
            type: Boolean,
            default: false
        },

        withProgress: {
            type: Boolean,
            default: false
        },

        searchable: {
            type: Boolean,
            default: true
        }
    },

    computed: {
        ...mapState(['disabled', 'page', 'table', 'toolbar', 'upload']),

        selected: function() {
            return this.table.selected.length > 0;
        },

        dynStyle: function() {
            if (this.fixed) {
                return `width: calc(100% - ${this.$vuetify.application.left}px)`;
            }

            return null;
        }
    },

    data:() => ({
        searchText: null
    }),

    methods: {
        ...mapActions([
            'editFormOpen', 'newFormOpen', 'recordReload', 
            'searchClose', 'searchOpen', 'trashFormClose', 'trashFormOpen'
        ]),

        bouncing: debounce(function (value) {
            this.$store.commit('toolbar', { text: value });
        }, 1000),
    },

    watch: {
        disabled: {
            handler: function() {
                if (!this.enableEdit) this.disabled.edit = true;
                if (!this.enableDelete) this.disabled.delete = true;
            },

            deep: true
        },

        searchText: function(newVal) {
            this.bouncing(newVal);
        },

        toolbar: {
            handler: function(newVal) {
                if ( newVal.search === true ) {
                    this.$nextTick(() => this.$refs.input.focus());
                }

                this.searchText = newVal.text;
            },

            deep: true 
        }
    }
};
</script>