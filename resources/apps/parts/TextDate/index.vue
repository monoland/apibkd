<template>
    <v-dialog ref="dialog"
        :return-value.sync="date"
        v-model="modal"
        persistent
        full-width
        width="290px"
    >
        <template v-slot:activator="{ on }">
            <v-text-field
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
    name: 'v-text-date',

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
        if (this.value) {
            this.date = this.value;
        } else {
            this.date = new Date().toISOString().substr(0, 10);
        }
    },

    watch: {
        date: function (newVal) {
            if (newVal) this.$emit('input', newVal);
        },

        value: function(newVal) {
            if (newVal) this.date = newVal;
        }
    }
};
</script>