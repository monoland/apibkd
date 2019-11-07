<template>
    <v-dialog ref="dialog"
        :return-value.sync="date"
        v-model="modal"
        persistent
        width="290px"
    >
        <template v-slot:activator="{ on }">
            <v-text-field
                autocomplete="off"
                v-model="date"
                :color="color"
                :label="label"
                readonly
                v-on="on"
            ></v-text-field>
        </template>

        <v-date-picker v-model="date" no-title @input="$refs.dialog.save(date)"></v-date-picker>
    </v-dialog>
</template>

<script>
export default {
    name: 'v-date-dialog',

    props: {
        color: {
            type: String,
            default: ''
        },

        label: {
            type: String,
            default: ''
        },

        value: null
    },

    data:() => ({
        date: null,
        modal: false
    }),
    
    created() {
        this.date = this.value;
    },

    watch: {
        date: function (newVal) {
            this.$emit('input', newVal);
        },

        value: function(newVal) {
            this.date = newVal;
        }
    }
};
</script>