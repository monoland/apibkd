<template>
    <v-navigation-drawer v-model="$root.navdrawer" app>
        <v-img 
            :aspect-ratio="16/9" 
            :class="`${$root.theme} lighten-3`" 
            :src="$root.background"
        >
            <v-layout column fill-height class="lightbox" :class="`${$root.theme}--text`">
                <v-spacer></v-spacer>

                <v-avatar size="56" class="ml-4 mb-3 elevation-2" color="white">
                    <v-img :src="$root.avatar"></v-img>
                </v-avatar>
                
                <v-flex class="v-user px-4 py-2 white--text" :class="{ 'expand': expand }" shrink @click="expand = !expand">
                    <div class="v-user__content">
                        <div class="font-weight-medium line-height1">{{ auth.user.name }}</div>
                        <div class="body-2">{{ auth.user.email }}</div>
                    </div>
                    <div class="v-user__action">
                        <v-icon dark>arrow_drop_down</v-icon>
                    </div>
                </v-flex>
            </v-layout>
        </v-img>

        <v-expand-transition>
            <div class="v-user__menu" v-show="expand" v-if="!$vuetify.breakpoint.xsOnly">
                <v-list>
                    <template v-for="(menu, index) in menus.account">
                        <v-list-item :active-class="$root.theme + '--text'" :to="menu.to" :key="index" v-if="menu.type === 'item'">
                            <v-list-item-action><v-icon>{{ menu.icon }}</v-icon></v-list-item-action>
                            <v-list-item-content>
                                <v-list-item-title>{{ menu.text }}</v-list-item-title>
                            </v-list-item-content>
                        </v-list-item>
                    </template>

                    <v-list-item :active-class="$root.theme + '--text'" @click="signout">
                        <v-list-item-action><v-icon>exit_to_app</v-icon></v-list-item-action>
                        <v-list-item-content>
                            <v-list-item-title>Keluar</v-list-item-title>
                        </v-list-item-content>
                    </v-list-item>
                </v-list>
                <v-divider></v-divider>
            </div>
        </v-expand-transition>

        <v-list v-if="!$vuetify.breakpoint.xsOnly">
            <template v-for="(menu, index) in menus.deskbar">
                <v-list-item :active-class="$root.theme + '--text'" :to="menu.to" :key="index" v-if="menu.type === 'item'">
                    <v-list-item-action><v-icon>{{ menu.icon }}</v-icon></v-list-item-action>
                    <v-list-item-content>
                        <v-list-item-title>{{ menu.text }}</v-list-item-title>
                    </v-list-item-content>
                </v-list-item>

                <v-divider :class="menu.class" :key="index" v-else-if="menu.type === 'divider'"></v-divider>

                <v-subheader 
                    class="text-uppercase" 
                    :class="menu.class" 
                    :key="index"
                    v-else-if="menu.type === 'subheader'"
                >{{ menu.text }}</v-subheader>

                <v-list-group :prepend-icon="menu.icon" :key="index" v-else>
                    <v-list-item slot="activator">
                        <v-list-item-title>{{ menu.text }}</v-list-item-title>    
                    </v-list-item>

                    <template v-for="(item, idx) in menu.items">
                        <v-list-item :to="item.to" :key="idx">
                            <v-list-item-action>
                                <v-icon>{{ item.icon }}</v-icon>
                            </v-list-item-action>
                            
                            <v-list-item-content>
                                <v-list-item-title>{{ item.text }}</v-list-item-title>
                            </v-list-item-content>
                        </v-list-item>
                    </template>
                </v-list-group>
            </template>
        </v-list>

        <v-list v-else>
            <template v-for="(menu, index) in menus.mobibar">
                <v-list-item :active-class="$root.theme + '--text'" :to="menu.to" :key="index" v-if="menu.type === 'item'">
                    <v-list-item-action><v-icon>{{ menu.icon }}</v-icon></v-list-item-action>
                    <v-list-item-content>
                        <v-list-item-title>{{ menu.text }}</v-list-item-title>
                    </v-list-item-content>
                </v-list-item>

                <v-divider :class="menu.class" :key="index" v-else-if="menu.type === 'divider'"></v-divider>

                <v-subheader 
                    class="text-uppercase" 
                    :class="menu.class" 
                    :key="index"
                    v-else-if="menu.type === 'subheader'"
                >{{ menu.text }}</v-subheader>

                <v-list-group :prepend-icon="menu.icon" :key="index" v-else>
                    <v-list-item slot="activator">
                        <v-list-item-title>{{ menu.text }}</v-list-item-title>    
                    </v-list-item>

                    <template v-for="(item, idx) in menu.items">
                        <v-list-item :to="item.to" :key="idx">
                            <v-list-item-action>
                                <v-icon>{{ item.icon }}</v-icon>
                            </v-list-item-action>
                            
                            <v-list-item-content>
                                <v-list-item-title>{{ item.text }}</v-list-item-title>
                            </v-list-item-content>
                        </v-list-item>
                    </template>
                </v-list-group>
            </template>
        </v-list>
    </v-navigation-drawer>
</template>

<script>
import { mapState, mapActions } from 'vuex';

export default {
    name: 'v-apps-menu',

    computed: {
        ...mapState(['auth', 'menus'])
    },

    data:() => ({
        expand: false
    }),

    mounted() {
        if (this.menus.constructor === Array && !this.menus.length && !this.auth.menus) { 
            this.fetchAppMenus();
        } else if (this.menus.constructor === Array && !this.menus.length && this.auth.menus) {
            this.$store.commit('fetchAppMenus');
        }
    },

    methods: {
        ...mapActions(['fetchAppMenus', 'signout'])
    }
}
</script>