import asyncRequest from "@/data-and-functions/API/asyncRequest.js";
import {headerAPI, user} from "@/data-and-functions/constants/URLS.js";


export default {
    actions: {
        async registerUser(context, body) {
            console.log(body);
            const res = await asyncRequest(user.register.URL, body, user.register.METHOD, headerAPI);
            console.log(res);
            if (!res.ok) {
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
        async loginUser(context, body) {
            console.log('loggin in');
            try {
                const res = await asyncRequest(user.login.URL, body, user.login.METHOD, headerAPI);
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
        },
        async updateUser(context, body) {
            try {
                const res = await asyncRequest(user.updateUser.URL, body, user.updateUser.METHOD, {
                    'Content-Type': 'application/json',
                    'Accept': '*',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                });
                console.log('обновляем данные пользователя');

                if (!res.ok) {
                    console.log('не обновили, ошибка');
                    const options = {
                        typeError: 'isUpdateErrorDetected',
                        boolean: true
                    }
                    context.commit('detectError', options);
                    context.commit('updateKey');

                    context.commit('updateErrorMessage', 'Не удалось обновить данные аккаунта.');
                } else {
                    console.log('обновлено успешно');
                    const options = {
                        typeError: 'isUpdateErrorDetected',
                        boolean: false
                    }
                    context.commit('detectError', options);
                    const userData = await res.json();
                    context.commit('updateUser', userData);
                    context.commit('updateLocalStorage', userData);
                }
            } catch (err) {
                console.error(err);
            }
        },
        async deleteUser(context, body) {
            try {
                const res = await asyncRequest(user.deleteUser.URL, body, user.deleteUser.METHOD, {
                    'Content-Type': 'application/json',
                    'Accept': '*',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                });
                console.log('удаляем аккаунт');

                if (!res.ok) {
                    console.log('не удалили, ошибка');
                    const options = {
                        typeError: 'isUpdateErrorDetected',
                        boolean: true
                    }
                    context.commit('detectError', options);
                    context.commit('updateErrorMessage', 'Не удалось удалить аккаунт :(');
                } else {
                    console.log('удален успешно');

                    this.$store.commit('logoutUser');
                    const options = {
                        typeError: 'isUpdateErrorDetected',
                        boolean: false
                    }
                    context.commit('detectError', options);
                    /*const userData = await res.json();
                    context.commit('updateUser', userData);
                    context.commit('updateLocalStorage', userData);*/
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
        isUpdateErrorDetected: false,
        isLoginErrorDetected: false,
        isRegErrorDetected: false,
        isDeleteUserErrorDetected: false,
        updateKey: 1,
    },
    getters: {
        GET_ALL_USER_INFO(state) {
            return state.user;
        },
        GET_USER_TOKEN(state) {
            if(!state.user.token) state.user.token = localStorage.getItem('token');
            return state.user.token;
        },
        IS_USER_OWNER(state) {
            return +state.user.role_id === 3;
        },
        GET_USER_SURNAME(state) {
            return state.user.surname ? state.user.surname : 'Гость';
        },
        IS_LOGGED_IN(state) {
            return state.isLoggedIn;
        },
        IS_LOGIN_ERROR_DETECTED(state) {
            return state.isLoginErrorDetected;
        },
        IS_REG_ERROR_DETECTED(state) {
            return state.isRegErrorDetected;
        },
        IS_UPDATE_ERROR_DETECTED(state) {
            return state.isUpdateErrorDetected;
        },
        GET_UPDATE_KEY(state) {
            return state.updateKey;
        }
    },
    mutations: {
        login(state, isLogin = true) {
            state.isLoggedIn = isLogin;
            if (isLogin && !localStorage.getItem('surname')) {
                this.commit('bringUserDataFromLS');
            } else if (isLogin) {
                this.commit('updateLocalStorage');
            }
            if (!isLogin) localStorage.removeItem('token');
        },
        logoutUser() {
            localStorage.clear();
            this.commit('login', false);
        },
        updateField(state, options) {
            if (options.instance) {
                for (let i = 0; i < options.fields.length; i++) {
                    state[options.instance][options.fields[i]] = options.values[i];
                }
            } else {
                for (let i = 0; i < options.fields.length; i++) {
                    state[options.fields[i]] = options.values[i];
                }
            }
        },
        updateUser(state, userData) {
            state.user.id = userData.id;
            state.user.token = userData.token;
            if (userData.first_name) {
                state.user.firstName = userData.first_name;
            } else {
                state.user.firstName = userData.firstName;
            }
            if (userData.middle_name) {
                state.user.middleName = userData.middle_name;
            } else {
                state.user.middleName = userData.middleName;
            }
            state.user.surname = userData.surname;
            state.user.phone = userData.phone;
            state.user.email = userData.email;
            if (userData.role_id) {
                state.user.role_id = userData.role_id;
            } else {
                state.user.role_id = userData.roleId;
            }

        },
        updateLocalStorage(state, userData) {
            localStorage.setItem('token', state.user.token);
            localStorage.setItem('userId', state.user.id);
            localStorage.setItem('role_id', userData.role_id);
            localStorage.setItem('firstName', state.user.firstName);
            localStorage.setItem('middleName', state.user.middleName);
            localStorage.setItem('surname', state.user.surname);
            localStorage.setItem('phone', state.user.phone);
            localStorage.setItem('email', state.user.email);
        },
        bringUserDataFromLS(state) {
            state.user.token = localStorage.getItem('token');
            state.user.id = localStorage.getItem('userId');
            state.user.firstName = localStorage.getItem('firstName');
            state.user.middleName = localStorage.getItem('middleName');
            state.user.surname = localStorage.getItem('surname');
            state.user.phone = localStorage.getItem('phone');
            state.user.email = localStorage.getItem('email');
            state.user.role_id = +localStorage.getItem('role_id');
        },
        checkLogin(state) {
            state.isLoggedIn = !!localStorage.getItem('token');
        },
        updateAuthorizationErrorMessage(state, newMessage) {
            state.authorizationErrorMsg = newMessage;
        },

        detectError(state, options) {
            state[options.typeError] = options.boolean;
        },
        updateKey(state) {
            state.updateKey += 1;
        },
    },
}
