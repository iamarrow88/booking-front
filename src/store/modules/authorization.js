import asyncRequest from "@/data-and-functions/API/asyncRequest.js";
import {headerAPI, user} from "@/data-and-functions/constants/URLS.js";


export default {
    actions: {
        async registerUser(context, body) {
            /*const token = this.$store.getters.GET_USER_TOKEN;*/
            const res = await asyncRequest(user.register.URL, body, user.register.METHOD, headerAPI);
            if(res.status === 200) {
                console.log('не вошли в акк');
                context.commit('updateErrorMessage', 'Не удалось войти в аккаунт. Проверьте введенные данные.');
                context.commit('login', false);
            } else {
                console.log('вошли в акк');
                const userData = await res.json();
                context.commit('login', true);
                context.commit('updateUser', userData);
                context.commit('updateLocalStorage', userData);
            }

        },
        async loginUser(context, body){
            try {
            const res = await asyncRequest(user.login.URL, body, user.login.METHOD, headerAPI);
                console.log('запрос отправили');

                if (!res.ok) {
                console.log('не вошли в акк');
                context.commit('updateErrorMessage', 'Не удалось войти в аккаунт. Проверьте логин и пароль.');
                context.commit('login', false);
                } else {
                console.log('вошли в акк');

                const userData = await res.json();
                context.commit('login', true);
                context.commit('updateUser', userData);
                context.commit('updateLocalStorage', userData);
                }
            } catch (err) {
                console.error(err);
            }
        }

    },
    state: {
        isLoggedIn: false,
        isOwner: false,
        user: {
            id: null,
            firstName: '',
            middleName: '',
            surname: '',
            email: '',
            phone: '',
            role_id: null, /*2 - user, 3 - owner*/
            token: '',
        },
        authorizationErrorMsg: null,
    },
    getters: {
        GET_ALL_USER_INFO(state){
            return state.user;
        },
        GET_USER_TOKEN(state) {
            return state.user.token;
        },
        IS_USER_OWNER(state){
            return +state.user.role_id === 3;
        },
        GET_USER_SURNAME(state){
            return state.user.surname ? state.user.surname : 'Гость'
        },
        IS_LOGGED_IN(state){
            return state.isLoggedIn;
        },
        GET_AUTHORIZATION_ERROR_MSG(state){
            return state.authorizationErrorMsg;
        }
    },
    mutations: {
        login(state, isLogin=true){
            state.isLoggedIn = isLogin;
            if(isLogin && !localStorage.getItem('surname')) {
                this.commit('bringUserDataFromLS');
            } else if(isLogin){
                this.commit('updateLocalStorage');
            }
            if(!isLogin) localStorage.removeItem('token');
        },
        logoutUser(){
            localStorage.clear();
            this.commit('login', false);
        },
        updateField(state, field, value, instance){
            if(instance) {
                state[instance][field] = value;
            } else {
                state[field] = value;
            }
        },
        updateUser(state, userData){
            state.user.id = userData.id;
            state.user.token = userData.token;
            if(userData.first_name) {
                state.user.firstName = userData.first_name;
            } else {
                state.user.firstName = userData.firstName;
            }
            if(userData.middle_name) {
                state.user.middleName = userData.middle_name;
            } else {
                state.user.middleName = userData.middleName;
            }
            state.user.surname = userData.surname;
            state.user.phone = userData.phone;
            state.user.email = userData.email;
            if(userData.role_id) {
                state.user.role_id = userData.role_id;
            } else {
                state.user.role_id = userData.roleId;
            }

        },
        updateLocalStorage(state, userData){
            localStorage.setItem('token', state.user.token);
            localStorage.setItem('userId', state.user.id);
            localStorage.setItem('role_id', userData.role_id);
            localStorage.setItem('firstName', state.user.firstName);
            localStorage.setItem('middleName', state.user.middleName);
            localStorage.setItem('surname', state.user.surname);
            localStorage.setItem('phone', state.user.phone);
            localStorage.setItem('email', state.user.email);
        },
        bringUserDataFromLS(state){
            state.user.token = localStorage.getItem('token');
            state.user.id = localStorage.getItem('userId');
            state.user.firstName = localStorage.getItem('firstName');
            state.user.middleName = localStorage.getItem('middleName');
            state.user.surname = localStorage.getItem('surname');
            state.user.phone = localStorage.getItem('phone');
            state.user.email = localStorage.getItem('email');
            state.user.role_id = +localStorage.getItem('role_id');
        },
        checkLogin(state){
            state.isLoggedIn = !!localStorage.getItem('token');
        },
        updateAuthorizationErrorMessage(state, newMessage){
            state.authorizationErrorMsg = newMessage;
        }
    },
}