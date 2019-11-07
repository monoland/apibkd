<template>
    <v-input
        class="align-right v-input--is-label-active v-input--is-dirty v-text-field v-text-field--is-booted v-money"
        :class="[{ 'v-input--is-focused': isFocus }, isFocus ? `${color}--text` : '']"

        :hint="hint"
        :persistent-hint="persistentHint"
        :append-icon="appendIcon"
        :disabled="disabled"
        :hide-details="hideDetails"
        :readonly="readonly"

        @click:append="$emit('click:append')"
    >
        <div class="v-text-field__slot">
            <label class="v-label v-label--active theme--light" style="left: 0px; right: auto; position: absolute;">{{ label }}</label>
            
            <input type="text" 
                :value="formattedValue" 
                @change="stateChange" 
                @focus="isFocus = true"
                @blur="isFocus = false"
                v-money="{ precision, decimal, thousands, prefix, suffix }"
            />
        </div>
    </v-input>
</template>

<script>
import money from './directive'
import defaults from './options'
import {format, unformat} from './utils'

export default {
    name: 'v-number-field',

    props: {
        value: {
            required: true,
            type: [Number, String],
            default: 0
        },

        color: {
            type: String,
            default:() => this.$root.theme
        },

        label: {
            type: String,
            default: ''
        },

        hint: {
            type: String,
            default: ''
        },

        persistentHint: {
            type: Boolean,
            default: false
        },

        appendIcon: {
            type: String,
            default: null
        },

        hideDetails: {
            type: Boolean,
            default: false
        },

        disabled: {
            type: Boolean,
            default: false
        },

        masked: {
            type: Boolean,
            default: false
        },
    
        precision: {
            type: Number,
            default: () => defaults.precision
        },
    
        decimal: {
            type: String,
            default: () => defaults.decimal
        },
    
        thousands: {
            type: String,
            default: () => defaults.thousands
        },

        prefix: {
            type: String,
            default: () => defaults.prefix
        },

        suffix: {
            type: String,
            default: () => defaults.suffix
        },

        readonly: {
            type: Boolean,
            default: false
        },
    },

    directives: {money},

    data:() => ({
        formattedValue: '',
        isFocus: false,
    }),

    mounted() {
        this.money = this.value
    },

    methods: {
        stateChange: function(evt) {
           this.$emit('input', this.masked ? evt.target.value : unformat(evt.target.value, this.precision));
        }
    },
    
    watch: {
        value: {
            handler: function(newValue) {
                let formatted = format(parseFloat(newValue), this.$props)

                if (formatted !== this.formattedValue) {
                   this.formattedValue = formatted
                }
            },

            immediate: true
        }
    }
};
</script>