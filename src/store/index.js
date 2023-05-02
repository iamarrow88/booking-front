import {createStore} from 'vuex';
import authorization from "@/store/modules/authorization";
import inventory from "@/store/modules/inventory";


const store = createStore({
    actions: {

    },
    state: {
        errorMessage: '',
    },
    getters: {
        GET_ERROR_MESSAGE(state){
            return state.errorMessage;
        }
    },
    mutations: {
        updateErrorMessage(state, errorMsg){
            state.errorMessage = errorMsg;
        },
    },

    modules: {
        authorization, inventory
    }
});

export default store