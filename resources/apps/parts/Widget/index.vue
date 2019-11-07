<template>
    <v-card 
        class="v-card--widget mt-4 mx-auto" 
        style="border-radius: 4px;"
        :elevation="elevation" 
        :width="width"
    >
        <v-sheet
            class="v-sheet--offset py-4 mx-auto"
            :color="color"
            :max-width="dynWidth"
            :class="dynClass"
        >
            <slot name="header">
                <span class="d-block line-height1 title font-weight-regular mb-1 white--text">{{ dynTitle }}</span>
                <span class="d-block f-nunito caption font-weight-regular text-uppercase white--text">{{ dynSubtitle }}</span>
            </slot>
        </v-sheet>

        <v-card-text :class="dynContent">
            <slot></slot>
        </v-card-text>

        <slot name="actions"></slot>
    </v-card>
</template>

<script>
import { mapState } from 'vuex';

export default {
    name: 'v-widget',

    computed: {
        ...mapState(['auth', 'page']),

        dynClass: function() {
            return 'px-4 pb-3';
        },

        dynContent: function() {
            return 'px-4 pb-1 pt-0';
        },

        dynWidth: function() {
            return 'calc(100% - 32px)';
        },

        dynTitle: function() {
            if (this.title) {
                return this.title;
            }

            if (this.table) {
                return `Tabel ${this.page.title}`;
            }
            
            return this.page.title;
        },

        dynSubtitle: function() {
            if (this.subtitle) {
                return this.subtitle;
            }

            let describe = this.auth.pageinfo;

            if (this.table) {
                if (describe) {
                    return `daftar ${this.page.title} pada ${describe}`;
                }

                return `daftar seluruh ${this.page.title} yang tersedia`;
            }

            if (describe) {
                return `tambah/ubah ${this.page.title} pada ${describe}`;    
            }

            return `form tambah/ubah ${this.page.title}`;
        }
    },

    props: {
        color: {
            type: String,
            default: function() {
                return this.$root.theme;  
            } 
        },

        elevation: {
            type: Number,
            default: 0
        },

        form: {
            type: Boolean,
            default: false
        },

        title: {
            type: String,
            default: null
        },

        subtitle: {
            type: String,
            default: null
        },

        table: {
            type: Boolean,
            default: false
        },

        width: {
            type: String,
            default: undefined
        }
    }
}
</script>