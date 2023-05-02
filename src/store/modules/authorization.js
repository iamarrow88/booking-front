import userActions from "@/data-and-functions/API/userActions.js";
import {headerAPI, user} from "@/data-and-functions/constants/URLS.js";


export default {
    actions: {
        /*async registration(context, body){
            try {
                const res = fetch('/api/user/register',{
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: body
                });
                if(!res.ok){
                    context.commit('updateErrorMessage', "Invalid data provided, please try again");
                    context.commit('login', false);
                } else {
                    const userData = await res.json();
                    context.commit('login', true);
                    context.commit('updateUser', userData);
                    context.commit('updateLocalStorage', userData);
                }
            } catch (e) {
                console.error(e)
            }
        },*/
        async registerUser(context, body) {
            /*const token = this.$store.getters.GET_USER_TOKEN;*/
            const res = await userActions.asyncRequest(user.register[0], body, user.register[1], headerAPI);
            if(res.status === 200) {
                console.log('не вошли в акк');
                console.log(res);
                context.commit('updateErrorMessage', "Invalid data provided, please try again");
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
            try {/*
                const res = await fetch('/api/user/login', {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify(body)
                });*/
            const res = await userActions.asyncRequest(user.login[0], body, user.login[1], headerAPI);
                console.log('запрос отправили');

                if (!res.ok) {
                console.log('не вошли в акк');

                context.commit('updateErrorMessage', "Invalid data provided, please try again");
                context.commit('login', false);
                } else {
                console.log('вошли в акк');

                const userData = await res.json();
                    console.log(userData);
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
        error: null,
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
        }
    },
    mutations: {
        login(state, isLogin=true){
            state.isLoggedIn = isLogin;
            if(isLogin && !localStorage.getItem('surname')) {
                console.log('here');
                this.commit('bringUserDataFromLS');
            } else if(isLogin){
                this.commit('updateLocalStorage');
            }
            if(!isLogin) localStorage.removeItem('token');
        },
        /*updateErrorMessage(state, errorMsg){
            state.error = errorMsg;
        },*/
        updateUser(state, userData){
            state.user.id = userData.id;
            state.user.token = userData.token;
            state.user.firstName = userData.first_name;
            state.user.middleName = userData.middle_name;
            state.user.surname = userData.surname;
            state.user.phone = userData.phone;
            state.user.role_id = userData.role_id;
        },
        updateLocalStorage(state, userData){
            console.log('updateLocalStorage');
            localStorage.setItem('token', state.user.token);
            localStorage.setItem('userId', state.user.id);
            if(userData) localStorage.setItem('role_id', userData.role_id);
            localStorage.setItem('firstName', state.user.firstName);
            localStorage.setItem('middleName', state.user.middleName);
            localStorage.setItem('surname', state.user.surname);
            localStorage.setItem('phone', state.user.phone);
            console.log(state);

        },
        bringUserDataFromLS(state){
            console.log('bringUserDataFromLS');
            console.log(state);

            state.user.token = localStorage.getItem('token');
            state.user.id = localStorage.getItem('userId');
            state.user.firstName = localStorage.getItem('firstName');
            state.user.middleName = localStorage.getItem('middleName');
            state.user.surname = localStorage.getItem('surname');
            state.user.phone = localStorage.getItem('phone');
            state.user.isOwner = +localStorage.getItem('role_id') === 3;
            console.log(state);

        },
        checkLogin(state){
            state.isLoggedIn = !!localStorage.getItem('token');
        }
    },
}