export default {
    actions: {},
    mutations: {
        setStartDate(state, newDate){
            state.shortDateFrom = newDate;
        },
        setEndDate(state, newDate){
            state.shortDateTo = newDate;
        },
        setStartTime(state, newTime){
            state.startTimeHour = newTime;
        },
        setEndTime(state, newTime){
            state.endTimeHour = newTime;
        },
        setSelectedResort(state, newResort){
            state.selectedResort = newResort;
        },
        setSelectedInvType(state, newInvType){
            state.selectedInvType = newInvType;
        },
        },
    state: {
        shortDateFrom: null,
        shortDateTo: null,

        fullDateFrom: null,
        fullDateTo: null,

        startTimeHour: null,
        endTimeHour: null,
        duration: null,

        selectedInvType: null,
        selectedResort: null,
    },
    getters: {
        GET_START_DATE(state){
            return state.shortDateFrom;
        },
        GET_END_DATE(state){
            return state.shortDateTo;
        },
        GET_START_TIME(state){
            return state.startTimeHour;
        },
        GET_END_TIME(state){
            return state.endTimeHour;
        },
        GET_SEL_INV_TYPES(state){
            return state.selectedInvType;
        },
        GET_SEL_RESORT(state){
            return state.selectedResort;
        },
        GET_DURATION(state){
            return state.duration;
        },
    }
}
