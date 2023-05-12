export default {
    actions: {

    },
    mutations: {
        updateSavedData(state, data){
            state.itemTypeName = data.itemTypeName;
            state.itemPrice = data.itemPrice;
            state.resortName = data.resortName;
            state.startDateShort = data.startDateShort;
            state.endDateShort = data.endDateShort;
            state.startTime = data.startTime;
            state.endTime = data.endTime;
            state.duration = data.duration;
            state.totalPrice = data.totalPrice;
        }
    },
    state: {
        itemTypeName: '',
        itemPrice: null,
        resortName: '',
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
