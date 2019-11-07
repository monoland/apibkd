<template>
    <v-list two-line subheader>
        <template v-for="(record, index) in records">
            <v-list-item :key="index" v-press="() => recordPress(record)" @click="editFormOpen(record)">
                <v-list-item-avatar>
                    <v-scale-transition mode="out-in">
                        <v-icon 
                            :key="`icon-${record.pinned}`" 
                            :class="{ 'deep-orange': record.pinned, 'grey lighten-1': !record.pinned }"
                            class="white--text"
                        >
                            {{ record.pinned ? 'done' : 'perm_identity' }}
                        </v-icon>
                    </v-scale-transition>
                </v-list-item-avatar>

                <slot :item="record" :index="index"></slot>
            </v-list-item>

            <v-divider :key="`divider-${index}`" inset></v-divider>
        </template>
    </v-list>
</template>

<script>
import { mapState, mapActions } from 'vuex';

export default {
    name: 'v-mobile-table',

    props: {
        icon: {
            type: String,
            default: 'perm_identity'
        }
    },

    computed: {
        ...mapState(['records', 'table'])
    },

    data:() => ({
        onSelected: false
    }),

    methods: {
        ...mapActions(['recordPress', 'editFormOpen']),

        dynClass: function(record) {
            let idx = this.table.selected.findIndex(obj => obj.id === record.id);

            if (idx === -1) {
                this.onSelected = false;
                return 'grey lighten-1';
            } else {
                this.onSelected = true;
                return 'deep-orange';
            }
        },

        dynIcon: function(record) {
            let idx = this.table.selected.findIndex(obj => obj.id === record.id);

            if (idx === -1) {
                return this.icon;
            } else {
                return 'done';
            }
        }
    }
}
</script>