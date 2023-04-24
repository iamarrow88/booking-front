export default {
    actions: {
        async registration(context, body){
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
        },
        async loginS(context, body){
            try {
                const res = await fetch('/api/user/login', {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify(body)
                });
                if (!res.ok) {
                    context.commit('updateErrorMessage', "Invalid data provided, please try again");
                    context.commit('login', false);
                } else {
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
        user: {
            id: null,
            firstName: '',
            middleName: '',
            surname: '',
            email: '',
            phone: '',
            isOwner: false,
            token: '',
        },
        error: null,
    },
    getters: {
    },
    mutations: {
        login(state, isLogin=true){
            console.log('login '+ isLogin);

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
            state.user.isOwner = +userData.role_id === 3;
        },
        updateLocalStorage(state, userData){
            console.log(userData);
            localStorage.setItem('token', state.user.token);
            localStorage.setItem('userId', state.user.id);
            if(userData) localStorage.setItem('role_id', userData.role_id);
            localStorage.setItem('firstName', state.user.firstName);
            localStorage.setItem('middleName', state.user.middleName);
            localStorage.setItem('surname', state.user.surname);
            localStorage.setItem('phone', state.user.phone);
        },
        bringUserDataFromLS(state){
            console.log('here');
            console.log(state);

            state.user.token = localStorage.getItem('token');
            state.user.id = localStorage.getItem('userId');
            state.user.firstName = localStorage.getItem('firstName');
            state.user.middleName = localStorage.getItem('middleName');
            state.user.surname = localStorage.getItem('surname');
            state.user.phone = localStorage.getItem('phone');
            state.user.isOwner = +localStorage.getItem('role_id') === 3;
            console.log(state);

        }
    },
}