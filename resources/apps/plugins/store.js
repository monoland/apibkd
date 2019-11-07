import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

import Axios from 'axios';
import Echo from 'laravel-echo';
import Auth from '@apps/mixins/AuthProvider';
import { baseURL, pusherEcho, pusherKey, pusherHost, pusherPort } from '@apps/.env.js';

import router from './router';

export default new Vuex.Store({
    state: {
        auth: Auth,
        document: { callback: () => {}, multiple: false, selected: [], state: false },
        echo: null,
        http: null,
        menus: [],
        
        afterAddnew:() => {},
        afterDelete:() => {},
        afterFormClose:() => {},
        afterFormOpen:() => {},
        afterSelected:() => {},
        afterUpdate:() => {},
        beforeAddnew:() => {},
        beforeDelete:() => {},
        beforeUpdate:() => {},
        cancelAddnew:() => { return false; },
        cancelDelete:() => { return false; },
        cancelUpdate:() => { return false; },
        cancelNewForm:() => { return false; },
        overideState:() => {},
        setRecord:() => {},

        combos: [],
        company: {},
        info: {},
        dataUrl: null,
        disabled: { add: false, delete: true, edit: true, find: false, link: true, refresh: false },
        form: { state: false, mode: 'addnew' },
        login: { username: null, userpass: null },
        headers: [],
        page: { state: 'default', icon: null, title: null, subtitle: null },
        primaryId: 'id',
        records: [],
        record: {},
        toolbar: { search: false, delete: false, text: null },
        trash: { state: false },
        snackbar: { state: false, text: null, color: null },
        table: { 
            initial: true, 
            loader: false, 
            options: { itemsPerPage: 10, page: 1 }, 
            footerProps: { 'items-per-page-options': [10, 25, 50] }, 
            total: 0, params: { itemsPerPage: 10, page: 1, sortBy: null, sortDesc: null}, 
            selected: [] 
        },
        upload: { combined: false, progress: false, value: 0 }
    },

    getters: {
        avatar: function(state) {
            return state.auth.avatar;
        },

        background: function(state) {
            return state.auth.background;
        },
    },

    mutations: {
        additional: function(state, payload) {
            if (payload && payload.hasOwnProperty('combos')) {
                state.combos = payload.combos;
            }

            if (payload && payload.hasOwnProperty('info')) {
                state.info = payload.info;
            }
        },

        afterAddnew: function(state, payload) {
            state.afterAddnew = payload;
        },

        afterDelete: function(state, payload) {
            state.afterDelete = payload;
        },

        afterFormClose: function(state, payload) {
            state.afterFormClose = payload;
        },

        afterFormOpen: function(state, payload) {
            state.afterFormOpen = payload;
        },

        afterUpdate: function(state, payload) {
            state.afterUpdate = payload;
        },

        afterSelected: function(state, payload) {
            state.afterSelected = payload;
        },

        auth: function(state, payload) {
            Object.keys(payload).forEach(key => {
                state.auth[key] = payload[key];
            });
        },

        authAvatar: function(state, payload) {
            state.auth.avatar = payload;
        },

        authBackground: function(state, payload) {
            state.auth.background = payload;
        },

        beforeAddnew: function(state, payload) {
            state.beforeAddnew = payload;
        },

        beforeDelete: function(state, payload) {
            state.beforeDelete = payload;
        },

        beforeUpdate: function(state, payload) {
            state.beforeUpdate = payload;
        },

        cancelAddnew: function(state, payload) {
            state.cancelAddnew = payload;
        },

        cancelDelete: function(state, payload) {
            state.cancelDelete = payload;
        },

        cancelUpdate: function(state, payload) {
            state.cancelUpdate = payload;
        },

        cancelNewForm: function(state, payload) {
            state.cancelNewForm = payload;
        },

        dataUrl: function(state, payload) {
            state.dataUrl = payload;
        },

        disabled: function(state, payload) {
            Object.keys(payload).forEach(key => {
                state.disabled[key] = payload[key];
            });
        },

        document: function(state, payload) {
            Object.keys(payload).forEach(key => {
                state.document[key] = payload[key];
            });
        },

        fetchAppInfos: function(state, payload) {
            state.company = payload;
        },

        fetchAppMenus: function(state, payload) {
            if (payload) state.auth.menus = payload;
            state.menus = state.auth.menus;
        },

        field: function(state, payload) {
            Object.keys(payload).forEach(key => {
                state.record[key] = payload[key];
            });
        },

        form: function(state, payload) {
            Object.keys(payload).forEach(key => {
                state.form[key] = payload[key];
            });
        },

        initStore: function(state) {
            if (state.http === null) {
                let headers = {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest'
                };

                if (state.auth.token !== null) {
                    headers = Object.assign({
                        'Authorization': state.auth.token
                    }, headers);
                }

                state.http = Axios.create({
                    baseURL: baseURL,
                    headers
                });
            } else {
                if (!state.http.defaults.headers.common.hasOwnProperty('Authorization') && state.auth.token !== null) {
                    state.http.defaults.headers.common['Authorization'] = state.auth.token;
                }
            }

            if (state.echo === null && pusherEcho === true && state.auth.token !== null) {
                state.echo = new Echo({
                    broadcaster: 'pusher',
                    key: pusherKey,
                    wsHost: pusherHost,
                    wsPort: pusherPort,
                    wssPort: pusherPort,
                    disableStats: true,
                    authEndpoint: '/api/broadcasting/auth',
                    auth: {
                        headers: {
                            Authorization: state.auth.token
                        },
                    },
                    // encrypted: true,
                    // cluster: 'ap1',
                });
            }

            if (state.menus.length === 0 && state.auth.token !== null) {
                if (state.auth.menus !== null) state.menus = state.auth.menus;
            }

            state.afterAddnew = () => {};
            state.afterDelete = () => {};
            state.afterFormClose = () => {};
            state.afterFormOpen = () => {};
            state.afterSelected = () => {};
            state.afterUpdate = () => {};
            state.beforeAddnew = () => {};
            state.beforeDelete = () => {};
            state.beforeUpdate = () => {};
            state.cancelAddnew = () => { return false; };
            state.cancelDelete = () => { return false; };
            state.cancelUpdate = () => { return false; };
            state.cancelNewForm = () => { return false; };
            state.overideState = () => {};
            state.setRecord = () => {};

            state.dataUrl = null;
            state.disabled = { add: false, delete: true, edit: true, find: false, link: true, refresh: false };
            state.form = { state: false, mode: 'addnew' };
            state.login = { username: null, userpass: null };
            state.headers = [];
            state.page = { state: 'default', icon: null, title: null, subtitle: null };
            state.primaryId = 'id';
            state.records = [];
            state.record = {};
            state.toolbar = { search: false, delete: false, text: null };
            state.trash = { state: false };
            state.snackbar = { state: false, text: null, color: null };
            state.table = { 
                initial: true, 
                loader: false, 
                options: { itemsPerPage: 10, page: 1 }, 
                footerProps: { 'items-per-page-options': [10, 25, 50] }, 
                total: 0, params: { itemsPerPage: 10, page: 1, sortBy: null, sortDesc: null}, 
                selected: [] 
            };
            state.upload = { combined: false, progress: false, value: 0 };
        },

        overideState: function({ state }, payload) {
            state.overideState = payload;
        },

        pageInfo: function(state, payload) {
            Object.keys(payload).forEach(key => {
                state.page[key] = payload[key];
            });
        },

        params: function(state, payload) {
            Object.keys(payload).forEach(key => {
                state.table.params[key] = payload[key];
            });
        },

        primaryId: function(state, payload) {
            state.primaryId = payload;
        },

        record: function(state, payload) {
            state.record = payload;
        },

        records: function(state, payload) {
            state.records = payload;
        },

        recordPush: function(state, payload) {
            state.records.push(payload);
        },

        recordSplice: function(state, index) {
            state.records.splice(index, 1);
        },

        recordUpdate: function(state, payload) {
            let idx = state.records.findIndex(obj => obj.id === payload.id);

            if (idx !== -1) {
                Object.keys(payload).forEach(key => {
                    state.records[idx][key] = payload[key];
                });
            }
        },

        tableParams: function(state, payload) {
            Object.keys(payload).forEach(key => {
                state.table.params[key] = payload[key];
            });
        },

        toolbar: function(state, payload) {
            Object.keys(payload).forEach(key => {
                state.toolbar[key] = payload[key];
            });
        },

        trash: function(state, payload) {
            Object.keys(payload).forEach(key => {
                state.trash[key] = payload[key];
            });
        },

        selectedPush: function(state, payload) {
            let idx = state.table.selected.findIndex(obj => obj.id === payload.id);

            payload.pinned = idx === -1;

            if (idx === -1) {
                state.table.selected.push(payload);
            } else {
                state.table.selected.splice(idx, 1);
            }
        },

        setRecord: function(state, payload) {
            state.setRecord = () => {
                state.record = Object.assign({}, payload)
            }
        },

        snackbar: function(state, payload) {
            Object.keys(payload).forEach(key => {
                state.snackbar[key] = payload[key];
            });
        },

        table: function(state, payload) {
            Object.keys(payload).forEach(key => {
                state.table[key] = payload[key];
            });
        },

        tableFilter: function(state, payload) {
            Object.keys(payload).forEach(key => {
                state.table.params[key] = payload[key];
            });
        },

        tableFilterRemove: function(state, payload) {
            Object.keys(payload).forEach(key => {
                if (state.table.params.hasOwnProperty(key)) {
                    delete state.table.params[key];
                }
            });
        },

        tableHeaders: function(state, payload) {
            state.headers = payload;
        },

        upload: function(state, payload) {
            Object.keys(payload).forEach(key => {
                state.upload[key] = payload[key];
            });
        },

        user: function(state, payload) {
            state.auth.user = payload;
        },
    },

    actions: {
        afterSelected: function({ state }, payload) {
            state.afterSelected(payload);
        },

        dataUrl: function({ commit }, payload) {
            commit('dataUrl', payload);
        },

        deleteClose: function({ commit }) {
            commit('toolbar', { delete: false });
        },

        deleteOpen: function({ commit }) {
            commit('toolbar', { delete: true });
        },

        documentClose: function({ commit }) {
            commit('document', { state: false });
        },

        documentOpen: function({ commit }) {
            commit('document', { state: true });
        },

        editFormClose: function({ commit }) {
            commit('form', { state: false, mode: null });
            commit('table', { selected: [] });
        },

        editFormOpen: function({ commit, state }, payload) {
            if (payload && payload.constructor === Object) {
                if (state.page.state === 'pinned') {
                    commit('selectedPush', payload);
                    return;
                } else {
                    commit('record', payload);
                }
            }

            commit('form', { state: true, mode: 'edit' });
            
            state.afterFormOpen(payload);
        },

        fetchAppInfos: async function({ commit, dispatch, state }) {
            try {
                let { data } = await state.http.get('/api/company');
                commit('fetchAppInfos', data);

            } catch (error) {
                dispatch('errors', error);
            }
        },

        fetchAppMenus: async function({commit, dispatch, state}) {
            try {
                let { data } = await state.http.get('/api/menus');
                commit('fetchAppMenus', data);
            } catch (error) {
                dispatch('errors', error);
            }
        },

        formClose: function({ state, dispatch }) {
            state.form.mode === 'edit' ? dispatch('editFormClose') : dispatch('newFormClose');
            state.afterFormClose();
        },

        formSubmit: function({ dispatch, state }) {
            state.form.mode === 'edit' ? dispatch('recordUpdate') : dispatch('recordAddnew')
        },

        initStore: function({ commit, dispatch, state }) {
            if (state.auth.token !== null && !state.auth.check) dispatch('signout');
        
            commit('initStore');
        },

        message: function({ commit }, payload) {
            commit('snackbar', {
                color: 'success',
                text: payload,
                state: true
            });
        },

        newFormClose: function({ commit }) {
            commit('form', { state: false, mode: null });
        },

        newFormOpen: function({ commit, state }) {
            if (state.cancelNewForm()) {
                commit('snackbar', {
                    color: 'warning',
                    text: 'This process is not allowed.',
                    state: true
                });

                return false;
            }

            state.setRecord();
            commit('form', { state: true, mode: 'addnew' });
            
            state.afterFormOpen();
        },

        overideState: function({ state }, payload) {
            state.overideState(payload);
        },

        pageInfo: function({ commit }, payload) {
            commit('pageInfo', payload);
        },

        passwordUpdate: async function({ dispatch, state }, payload) {
            try {
                await state.http.put(
                    '/api/password', payload
                );
                
                dispatch('message', 'update password berhasil!');
            } catch (error) {
                dispatch('errors', error);
            }
        },

        profileAvatar: async function({ commit, dispatch, state }, payload) {
            try {
                let { data } = await state.http.put(
                    '/api/profile', { avatar: payload.path }
                );
                
                commit('auth', { avatar: data.avatar });
                dispatch('message', 'update avatar berhasil!');
            } catch (error) {
                dispatch('errors', error);
            }
        },

        profileBackground: async function({ commit, dispatch, state }, payload) {
            try {
                let { data } = await state.http.put(
                    '/api/profile', { background: payload.path }
                );
                
                commit('auth', { background: data.background });
                dispatch('message', 'update background berhasil!');
            } catch (error) {
                dispatch('errors', error);
            }
        },

        profileUpdate: async function({ commit, dispatch, state }, payload) {
            try {
                let { data } = await state.http.put(
                    '/api/profile', {
                        name: payload.name,
                        email: payload.email,
                        theme: payload.theme
                    }
                );

                commit('auth', { name: data.name, email: data.email, theme: data.theme });
                dispatch('message', 'update profile berhasil!');
            } catch (error) {
                dispatch('errors', error);
            }
        },

        recordAddnew: async function({ commit, dispatch, state }) {
            try {
                state.beforeAddnew();
                
                if (state.cancelAddnew()) {
                    commit('form', { state: false, mode: null });
                    return;
                }

                let { data } = await state.http.post(
                    state.dataUrl, state.record
                );

                commit('recordPush', data);
                commit('form', { state: false, mode: null });
                dispatch('message', 'proses simpan berhasil!');

                if (state.records.length === 1) dispatch('recordFetch');

                state.afterAddnew();
            } catch (error) {
                dispatch('errors', error);
                commit('form', { state: false, mode: null });
            }
        },

        recordDelete: async function({ commit, dispatch, state }) {
            try {
                state.beforeDelete();

                if (state.cancelDelete()) {
                    commit('form', { state: false, mode: null });
                    return;
                }

                let selected = state.table.selected;
                let currentRecord = state.record;

                if (selected.length <= 1) {
                    let index = state.records.findIndex(obj => obj.id === currentRecord.id);
                    let primaryKey = state.record[state.primaryId];

                    let response = await state.http.delete(
                        state.dataUrl + '/' + primaryKey
                    );

                    if (response) {
                        commit('recordSplice', index);
                    }
                } else {
                    let response = await state.http.post(
                        state.dataUrl + '/bulks', selected
                    );

                    if (response) {
                        selected.forEach((record) => {
                            let index = state.records.findIndex(obj => obj.id === record.id);
                            commit('recordSplice', index);
                        });
                    }
                }

                state.afterDelete();
            } catch (error) {
                dispatch('errors', error);
            } finally {
                commit('trash', { state: false });
                commit('table', { selected: [] });
                dispatch('message', 'proses hapus berhasil!');
            }
        },

        recordFetch: async function({ commit, dispatch, state }, payload) {
            commit('table', { loader: `${state.auth.theme}` });

            try {
                let url = state.dataUrl;
                let params = state.table.params;

                if (url.includes('/api/document')) {
                    commit('document', { records: [] });
                }

                if (payload) params = payload;
                
                let { data: { additional, data, meta }} = await state.http.get( url, { params: params });

                commit('additional', additional);
                commit('records', data);
                commit('table', { total: meta.total, initial: false, selected: [] });
            } catch (error) {
                dispatch('errors', error);
            } finally {
                commit('table', { loader: false });
            }
        },

        recordNew: function({ state }) {
            state.setRecord();
        },

        recordPress: function({ commit, state }, payload) {
            if (state.page.state === 'pinned') return;

            commit('pageInfo', { state: 'pinned' });
            commit('toolbar', { delete: true });
            commit('selectedPush', payload);
        },

        recordRefetch: function({commit, dispatch, state}, payload) {
            if (payload.new && (payload.new.length > 0)) {
                commit('params', { search: payload.new });
                dispatch('recordFetch');
            } else {
                if (payload.old && (payload.old.length > 0)) {
                    commit('params', { search: null });
                    dispatch('recordFetch');
                } else {
                    if (state.table.initial) return;

                    dispatch('recordFetch', payload.fetch);
                }
            }
        },

        recordReload: function({ dispatch }) {
            dispatch('recordFetch');
        },

        recordUpdate: async function({ commit, dispatch, state }) {
            try {
                state.beforeUpdate();
                
                if (state.cancelUpdate()) {
                    commit('form', { state: false, mode: null });
                    return;
                }

                let primaryKey = state.record[state.primaryId];

                let { data } = await state.http.put(
                    state.dataUrl + '/' + primaryKey, state.record
                );
                
                commit('record', data);
                commit('recordUpdate', data);
                commit('form', { state: false, mode: null });
                commit('table', { selected: [] });
                dispatch('message', 'proses update berhasil!');
                
                state.afterUpdate();
            } catch (error) {
                dispatch('errors', error);
                commit('form', { state: false, mode: null });
            }
        },

        searchClose: function({ commit }) {
            commit('toolbar', { search: false, text: null });
        },

        searchOpen: function({ commit }) {
            commit('toolbar', { search: true });
        },

        setAfterAddnew: function({ commit }, payload) {
            commit('afterAddnew', payload);
        },

        setAfterDelete: function({ commit }, payload) {
            commit('afterDelete', payload);
        },

        setAfterFormClose: function({ commit }, payload) {
            commit('afterFormClose', payload);
        },

        setAfterFormOpen: function({ commit }, payload) {
            commit('afterFormOpen', payload);
        },

        setAfterSelected: function({ commit }, payload) {
            commit('afterSelected', payload);
        },

        setAfterUpdate: function({ commit }, payload) {
            commit('afterUpdate', payload);
        },

        setBeforeAddnew: function({ commit }, payload) {
            commit('beforeAddnew', payload);
        },

        setBeforeDelete: function({ commit }, payload) {
            commit('beforeDelete', payload);
        },

        setBeforeUpdate: function({ commit }, payload) {
            commit('beforeUpdate', payload);
        },

        setCancelAddnew: function({ commit }, payload) {
            commit('cancelAddnew', payload);
        },

        setCancelDelete: function({ commit }, payload) {
            commit('cancelDelete', payload);
        },

        setCancelUpdate: function({ commit }, payload) {
            commit('cancelUpdate', payload);
        },

        setCancelNewForm: function({ commit }, payload) {
            commit('cancelNewForm', payload);
        },

        setFilter: function({ commit }, payload) {
            commit('tableFilter', payload);
        },

        setOverideState: function({ commit }, payload) {
            commit('overideState', payload);
        },

        setPrimaryId: function({ commit }, payload) {
            commit('primaryId', payload);
        },

        setRecord: function({ commit }, payload) {
            commit('setRecord', payload);
        },

        settingAvatar: function({ commit }, payload) {
            commit('field', { avatar: payload.path });
        },

        settingBackground: function({ commit }, payload) {
            commit('field', { background: payload.path });
        },

        settingUpdate: async function({ dispatch, state }) {
            try {
                await state.http.put(
                    '/api/setting/company', state.record
                );
                
                dispatch('message', 'proses update berhasil!');
            } catch (error) {
                dispatch('errors', error);
            }
        },

        settingFetch: async function({ commit, dispatch, state }) {
            try {
                let { data } = await state.http.get('/api/setting/company');
                commit('record', data);
            } catch (error) {
                dispatch('errors', error);
            }
        },

        signin: async function({ commit, dispatch, state }) {
            try {
                let token = await state.http.post('/oauth/token', {
                    grant_type: 'password',
                    client_id: state.auth.siteKey,
                    client_secret: state.auth.secretKey,
                    username: state.login.username,
                    password: state.login.userpass,
                    scope: '*'
                });
                
                state.auth.token = token.data;
                state.http.defaults.headers.common['Authorization'] = token.data.token_type + ' ' + token.data.access_token;

                let user = await state.http.get('/api/user');
                commit('user', user.data );

                router.push({ name: 'home' });
            } catch (error) {
                dispatch('errors', error);
            }
        },

        signout: function({state}) {
            state.auth.signout();
            router.push({ name: 'login' });
        },

        snackbarClose: function({ commit }) {
            commit('snackbar', { state: false });
        },

        tableHeaders: function({ commit }, payload) {
            commit('tableHeaders', payload);
        },

        trashFormClose: function({ commit, state }) {
            state.table.selected.forEach(record => record.pinned = false);

            commit('trash', { state: false });
            commit('table', { selected: [] });
            commit('toolbar', { delete: false });
        },

        trashFormOpen: function({ commit }) {
            commit('trash', { state: true });
        },

        errors: function({ commit, state }, payload) {
            if (payload.hasOwnProperty('response')) {
                let { message, errors, error, hint } = payload.response.data;
                let status = payload.response.status;

                if (status === 401) {
                    state.auth.signout();
                    commit('snackbar', {
                        color: 'error',
                        text: 'The user credentials were incorrect.',
                        state: true
                    });
                } else if (status === 403) {
                    commit('snackbar', {
                        color: 'error',
                        text: 'This action is unauthorized.',
                        state: true
                    });
                } else if (error && hint) {
                    commit('snackbar', {
                        color: 'error',
                        text: hint,
                        state: true
                    });
                } else if (error && !hint) {
                    commit('snackbar', {
                        color: 'error',
                        text: message,
                        state: true
                    });
                } else if (errors && message) {
                    commit('snackbar', {
                        color: 'error',
                        text: message,
                        state: true
                    });
                } else {
                    commit('snackbar', {
                        color: 'error',
                        text: 'there is an error while data process on server.',
                        state: true
                    });
                }
            } else if (payload.hasOwnProperty('message')) {
                commit('snackbar', {
                    color: 'error',
                    text: payload.message,
                    state: true
                });
            } else {
                commit('snackbar', {
                    color: 'error',
                    text: payload,
                    state: true
                });
            }

            window.console.clear();
        }
    }
});