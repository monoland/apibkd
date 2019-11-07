<template>
    <v-tooltip bottom>
        <template v-slot:activator="{ on }">
            <v-scale-transition>
                <v-btn :class="{ 'static': sticky }" icon :key="label" :color="$root.theme" @click="$emit('click')" v-on="on" v-show="show">
                    <v-icon>{{ icon }}</v-icon>
                </v-btn>
            </v-scale-transition>
        </template>

        <span>{{ label }}</span>
    </v-tooltip>
</template>

<script>
export default {
    name: 'v-btn-tips',

    props: {
        bottom: {
            type: Boolean,
            default: true
        },

        left: {
            type: Boolean,
            default: false
        },

        right: {
            type: Boolean,
            default: false
        },

        sticky: {
            type: Boolean,
            default: false
        },

        top: {
            type: Boolean,
            default: false
        },

        icon: {
            type: String,
            default: null
        },

        label: {
            type: String,
            default: null
        },

        show: {
            type: Boolean,
            default: false
        }
    }
};
</script>