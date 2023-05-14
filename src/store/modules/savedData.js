export default {
    actions: {

    },
    mutations: {
        updateSavedData(state, data){
            state.item = data.item;
            state.startDateShort = data.startDateShort;
            state.endDateShort = data.endDateShort;
            state.startTime = data.startTime;
            state.endTime = data.endTime;
            state.duration = data.duration;
            state.totalPrice = data.totalPrice;
        }
    },
    state: {
        item: {},
        startDateShort: '',
        endDateShort: '',
        startTime: '',
        endTime: '',
        duration: null,
        totalPrice: null,
    },
    getters: {
        GET_SAVED_DATA(state){
            return state;
        }
    }

}
