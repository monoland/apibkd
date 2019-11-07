import * as CryptoJS from 'crypto-js';
import SecureStorage from 'secure-web-storage';
import { siteKey, secretKey } from '@apps/.env.js';

class Authentication
{
    constructor() {
        let SECRET_KEY = secretKey;

        this.store = new SecureStorage(localStorage, {
            hash: function hash(key) {
                key = CryptoJS.SHA256(key, SECRET_KEY);
        
                return key.toString();
            },
            encrypt: function encrypt(data) {
                data = CryptoJS.AES.encrypt(data, SECRET_KEY);
        
                data = data.toString();
        
                return data;
            },
            decrypt: function decrypt(data) {
                data = CryptoJS.AES.decrypt(data, SECRET_KEY);
        
                data = data.toString(CryptoJS.enc.Utf8);
        
                return data;
            }
        });

        this.user = null;
        this.mode = 'client-mode';
        this.siteKey = siteKey;
        this.secretKey = secretKey;
    }

    get user() {
        return this.store.getItem('user');
    }

    set user(response) {
        if (!response) return;

        this.store.setItem('user', response);
        this.store.setItem('avatar', response.avatar);
        this.store.setItem('background', response.background);
        this.store.setItem('theme', response.theme);
        this.store.setItem('authent', response.authent_name);
    }

    set update(user) {
        this.store.setItem('user', user);
    }

    get avatar() {
        return this.store.getItem('avatar');
    }

    set avatar(avatar) {
        this.store.setItem('avatar', avatar);
    }

    get background() {
        return this.store.getItem('background');
    }

    set background(background) {
        this.store.setItem('background', background);
    }

    get authent() {
        return this.store.getItem('authent');
    }

    get check() {
        return !!this.store.getItem('access_token') && !this.expired;
    }

    get theme() {
        return this.store.getItem('theme');
    }

    set theme(theme) {
        if (!theme) return;

        this.store.setItem('theme', theme);
    }

    get menus() {
        return this.store.getItem('menus');
    }

    set menus(menus) {
        if (!menus) return;

        this.store.setItem('menus', menus);
    }

    get serverMode() {
        return this.mode === 'server-mode';
    }

    set token(response) {
        if (!response) return;

        this.store.clear();
        this.store.setItem('access_token', response.access_token);
        this.store.setItem('expires_in', response.expires_in);
        this.store.setItem('refresh_token', response.refresh_token);
        this.store.setItem('token_type', response.token_type);
        this.store.setItem('token_create', Date.now());
    }

    get token() {
        if (this.store.getItem('token_type') === null ) {
            return null;
        }
        
        return this.store.getItem('token_type') + ' ' + this.store.getItem('access_token');
    }

    get csrf() {
        return (document.head.querySelector('meta[name="csrf-token"]')).content;
    }

    get expired() {
        let minute = parseInt((Date.now() - parseInt(this.store.getItem('token_create'))) / 1000);
        let expire = parseInt(this.store.getItem('expires_in'));

        return minute >= expire;
    }

    updateUser(user) {
        this.store.setItem('user', user);
    }

    signout() {
        this.store.clear();
    }
}

export default new Authentication();