<template>
    <div class="v-page">
        <slot name="toolbar">
            <v-page-header 
                :absolute="absolute"
                :crud="crud"  
                :flat="flat"
                :searchable="searchable"
                :withProgress="withProgress"
                :enable-delete="enableDelete"
                :enable-edit="enableEdit"
            >
                <template #navigate>
                    <slot name="navigate"></slot>
                </template>

                <template #add-button>
                    <slot name="add-button"></slot>
                </template>

                <template #default>
                    <slot name="toolbar-default"></slot>
                </template>
            </v-page-header>
        </slot>
        
        <div class="v-page__content">
            <div class="v-page__wrap">
                <slot></slot>

                <v-page-trash v-if="!noTrash"></v-page-trash>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'v-page-wrap',

    props: {
        absolute: {
            type: Boolean,
            default: false
        },

        crud: {
            type: Boolean,
            default: false
        },

        enableDelete: {
            type: Boolean,
            default: true
        },

        enableEdit: {
            type: Boolean,
            default: true
        },

        flat: {
            type: Boolean,
            default: false
        },

        noTrash: {
            type: Boolean,
            default: false
        },

        withProgress: {
            type: Boolean,
            default: false
        },

        searchable: {
            type: Boolean,
            default: false
        }
    },
};
</script>