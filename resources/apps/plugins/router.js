import Vue from 'vue';
import VueRouter from 'vue-router';
import Auth from '@apps/mixins/AuthProvider';

Vue.use(VueRouter);

let routes = [];
let keep = null;

import * as frontend from '@apps/pages/frontend';
import * as backend from '@apps/pages/backend';
import * as project from '@apps/pages/project';

extractRouteFrom(frontend);
extractRouteFrom(backend);
extractRouteFrom(project);

function extractRouteFrom(components) {
    Object.keys(components).forEach(page => {
        if (!components[page].route) return;

        components[page].route.forEach(route => {
            if (route.path === '*') {
                keep = Object.assign({ component: components[page] }, route);
                return;
            }

            if (route.hasOwnProperty('root')) {
                let idx = routes.findIndex(obj => obj.node === route.root);

                if (idx !== -1) {
                    delete route.root;
                    
                    if (routes[idx].children.length > 0) {
                        let idn = routes[idx].children.findIndex(obj => obj.path === route.path);
                        if (idn === -1) {
                            routes[idx].children.push(Object.assign({ component: components[page] }, route));
                        }
                    } else {
                        routes[idx].children.push(Object.assign({ component: components[page] }, route));
                    }
                }
            } else {
                let idx = routes.findIndex(obj => obj.path === route.path);
                if (idx === -1) routes.push(Object.assign({ component: components[page] }, route));
            }
        });

        delete components[page].route;
    });
}

if (keep !== null) routes.push(keep);

const router = new VueRouter({
    mode: 'hash',
    routes
});

router.beforeEach((to, from, next) => {
    if (to.matched.some(record => record.meta.auth)) {
        if (!Auth.check) {
            next({ name: 'login' });
        } else {
            next();
        }
    } else {
        if (to.name === 'login' && Auth.check) {
            next({ name: 'home' });
        } else {
            next();
        }
    }
});

router.onError(() => {
    Auth.signout();
    router.push({ name: 'login' });
});

export default router;