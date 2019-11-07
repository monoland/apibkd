import { mapState, mapActions } from 'vuex';

export const pageMixins = {
    computed: {
        ...mapState([
            'additional', 'disabled', 'form', 'headers', 'http', 'page', 
            'record', 'records', 'table', 'toolbar'
        ]),

        desktop: function() {
            return !this.$vuetify.breakpoint.xsOnly;
        },

        tablet: function() {
            return this.$vuetify.breakpoint.smOnly;
        }
    },

    created() {
        this.initStore();
    },

    mounted() {
        this.recordNew();
        this.recordFetch();
    },

    methods: {
        ...mapActions([
            'afterSelected', 'dataUrl', 'recordFetch', 'initStore', 
            'overideState', 'pageInfo', 'recordNew', 'setRecord', 
            'setAfterSelected', 'setOverideState', 'tableHeaders',
            'newFormOpen', 'setUploadCallback', 'setFilter', 'setAfterFormClose'
        ])
    },

    watch: {
        'page.state': function(newval) {
            switch (newval) {
                case 'delete':
                    this.$store.commit('disabled', { add: true, delete: false, edit: true, find: true, link: true });
                    break;
                
                case 'select':
                    this.$store.commit('disabled', { add: true, delete: false, edit: false, find: true, link: false });
                    this.overideState();
                    break;
                
                case 'pinned':
                    this.$store.commit('disabled', { add: false, delete: true, edit: true, find: false, link: true });
                    break;
            
                default:
                    this.$store.commit('disabled', { add: false, delete: true, edit: true, find: false, link: true });
                    break;
            }
        },

        '$route.query': {
            handler: function(newVal) {
                if (Object.keys(newVal).length === 0 && newVal.constructor === Object) {
                    this.$store.commit('tableFilterRemove', {
                        filterBy: null, filterOn: null
                    });

                    this.$nextTick(() => this.$store.dispatch('recordReload'));
                }
            },

            deep: true
        },

        'table.options': {
            handler: function(newVal) {
                if (this.table.initial) return;

                this.$store.commit('tableParams', {
                    itemsPerPage: newVal.itemsPerPage, 
                    page: newVal.page, 
                    sortBy: newVal.sortBy[0], 
                    sortDesc: newVal.sortDesc[0]
                });
            },

            deep: true
        },

        'table.params': {
            handler: function(newVal) {
                this.$store.dispatch('recordRefetch', { fetch: newVal });

            },

            deep: true
        },

        'table.selected': function(newval) {
            switch (newval.length) {
                case 0:
                    if (this.toolbar.text && this.toolbar.text.length > 0) {
                        this.$store.commit('toolbar', { search: true });
                    }

                    if (this.page.state === 'pinned') {
                        this.$store.commit('toolbar', { delete: false });
                    }

                    this.$store.commit('record', {});
                    this.$store.commit('pageInfo', { state: 'default' });
                    break;
                
                case 1:
                    this.$store.commit('toolbar', { search: false });
                    this.$store.commit('record', Object.assign({}, newval[0]));
                    if (this.page.state !== 'pinned') this.$store.commit('pageInfo', { state: 'select' });
                    
                    this.afterSelected(this.record);
                    break;
                
                default:
                    this.$store.commit('toolbar', { search: false });
                    if (this.page.state !== 'pinned') this.$store.commit('pageInfo', { state: 'delete' });
                    
                    break;
            }
        },

        'toolbar.text': function(newval, oldval) {
            this.$store.dispatch('recordRefetch', {
                new: newval, 
                old: oldval
            });
        },
    }
};