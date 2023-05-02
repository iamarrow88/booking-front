import { headerWithToken } from '../constants/URLS.js'

export default {
    /*registrationAPI: async function(body) {
        try {
            const res = fetch(user.register[0],{
                method: user.register[1],
                headers: headersAPI,
                body: body
            });
            return res;
            /!*if(!res.ok){
                context.commit('updateErrorMessage', "Invalid data provided, please try again");
                context.commit('login', false);
            } else {
                const userData = await res.json();
                context.commit('login', true);
                context.commit('updateUser', userData);
                context.commit('updateLocalStorage', userData);
            }*!/
        } catch (e) {
            console.error(e)
        }
    },
    loginAPI: async function(body){

    }*/

    /*@params*/

    asyncRequest: async function(url, body, method, header, token){
        let res;
        if(token) {
            headerWithToken.Authorization += token;
            res = fetch(url,{
                method: method,
                headers: headerWithToken,
                body: JSON.stringify(body)
            });
        } else if(header){
            res = fetch(url,{
                method: method,
                headers: header,
                body: JSON.stringify(body)
            });
        } else if(!method) {
            res = fetch(url);
        } else {
            console.log('ошибка: ничего не подошло');
        }
        return res;
    }
}