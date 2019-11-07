<template>
    <div class="v-attachment">
        <v-expand-transition>
            <div class="v-attachment__wrap" v-if="files.length">
                <div class="v-attachment__list">
                    <template v-for="(file, index) in files">
                        <v-expand-transition :key="index">
                            <div class="v-attachment__item" :key="index">
                                <div class="v-attachment__hold">
                                    <div class="v-attachment__icon">
                                        <v-icon>attach_file</v-icon>
                                    </div>

                                    <div class="v-attachment__text d-flex justify-space-between">
                                        <div class="text-truncate">{{ file.name }}</div>
                                        
                                        <div class="text--secondary caption">{{ `Size: ${$root.formatBytes(file.byte)}` }}</div>
                                    </div>

                                    <v-btn :color="$root.theme" depressed small icon @click="documentRemove(file)">
                                        <v-icon>cancel</v-icon>
                                    </v-btn>
                                </div>

                                <v-divider></v-divider>
                            </div>
                        </v-expand-transition>
                    </template>
                </div>
            </div>
        </v-expand-transition>

        <div class="v-attachment__button">
            <v-btn block depressed :color="$root.theme" dark @click="openFileBrowser">Klik untuk buka file browser</v-btn>
        </div>
    </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';

export default {
    name: 'v-attachment',

    props: {
        multiple: {
            type: Boolean,
            default: true
        },

        value: null
    },

    computed: {
        ...mapState(['document']),
    },

    data:() => ({
        files: []
    }),

    created() {
        if (this.value && this.value.constructor === Array) {
            this.files = this.value;
        }
    },

    methods: {
        ...mapActions(['documentOpen']),

        documentRemove: function(file) {
            let idx = this.files.findIndex(obj => obj.id === file.id);

            if (idx !== -1) this.files.splice(idx, 1);
        },
        
        openFileBrowser: function() {
            this.$store.commit('document', {
                multiple: this.multiple,
                selected: this.files,
                callback: (selected) => {
                    this.files = selected;
                }
            });

            this.$nextTick(() => this.documentOpen());
        }
    },

    watch: {
        files: function(newVal) {
            if (newVal && newVal.constructor === Array) this.$emit('input', newVal);
        }
    }
};
</script>