<template>
    <div class="v-alert v-sheet theme--light v-alert--border v-alert--border-left" @click="onClick">
        <div class="v-alert__wrapper">
            <v-icon :color="$root.theme" class="v-alert__icon">{{ icon }}</v-icon>
            
            <div class="v-alert__content">
                <slot></slot>
            </div>
            
            <div class="v-alert__border v-alert__border--left cyan v-alert__border--has-color"></div>
            
            <v-btn v-if="closeable && !clickable"
                :color="$root.theme" 
                class="v-alert__dismissible" 
                depressed small icon
                @click.stop="onClose"
            >
                <v-icon>cancel</v-icon>
            </v-btn>
        </div>
    </div>
</template>

<script>
export default {
    name: 'v-fileitem',

    props: {
        clickable: {
            type: Boolean,
            default: false
        },

        closeable: {
            type: Boolean,
            default: false
        },

        icon: {
            type: String,
            default: 'attach_file'
        }
    },

    methods: {
        onClick: function() {
            if (this.clickable) this.$emit('click');
        },

        onClose: function() {
            if (!this.clickable) this.$emit('click');
        }
    }
};
</script>
