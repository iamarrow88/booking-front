import {createStore} from 'vuex';
import authorization from "@/store/modules/authorization";
import inventory from "@/store/modules/inventory";


const store = createStore({
    actions: {

    },
    state: {

    },
    getters: {

    },
    mutations: {
        updateErrorMessage(state, errorMsg){
            state.error = errorMsg;
        },
    },

    modules: {
        authorization, inventory
    }
});

export default store