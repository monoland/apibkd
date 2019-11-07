<template>
    <v-dialog 
        v-model="trash.state"
        max-width="332px"
        persistent 
    >
        <v-card 
            class="v-card--widget mt-4 mx-auto" 
            style="border-radius: 4px;"
            elevation="0" 
        >
            <v-sheet
                class="v-sheet--offset py-4 px-4 pb-3 mx-auto"
                color="deep-orange"
                max-width="calc(100% - 32px)"
            >
                <span class="d-block line-height1 title font-weight-regular mb-1 white--text">{{ `Hapus ${table.selected.length} data?` }}</span>
                <span class="d-block f-nunito caption font-weight-regular text-uppercase white--text">konfirmasi penghapusan data.</span>
            </v-sheet>

            <v-card-text class="px-4" style="text-align: justify;">
                <span>
                    Menghapus data ini juga akan menghapus semua data yang terhubung dengan ini. Anda tidak dapat membatalkan ini.
                </span>
            </v-card-text>

            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn text :color="$root.theme" @click="recordDelete">{{ submitName }}</v-btn>
                <v-btn text :color="$root.theme" @click="trashFormClose">{{ cancelName }}</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>    
</template>

<script>
import { mapState, mapActions } from 'vuex';

export default {
    name: 'v-page-trash',

    computed: {
        ...mapState(['trash', 'table', 'records'])
    },

    props: {
        submitName: {
            type: String,
            default: 'delete'
        },

        cancelName: {
            type: String,
            default: 'cancel'
        },
    },

    methods: {
        ...mapActions(['trashFormClose', 'recordDelete'])
    }
};
</script>
