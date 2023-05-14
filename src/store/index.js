import {createStore} from 'vuex';
import authorization from "@/store/modules/authorization";
import inventory from "@/store/modules/inventory";
import selected from "@/store/modules/selected";
import savedData from "@/store/modules/savedData";


const store = createStore({
    actions: {},
    state: {
        errorMessage: '',
        todayShortDate: null,
    },
    getters: {
        GET_ERROR_MESSAGE(state) {
            return state.errorMessage;
        }
    },
    mutations: {
        updateErrorMessage(state, errorMsg) {
            state.errorMessage = errorMsg;
        },
    },

    modules: {
        authorization, inventory, selected, savedData
    }
});

export default store
