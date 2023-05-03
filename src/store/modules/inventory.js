import asyncRequest from "@/data-and-functions/API/asyncRequest";
import {dataArrays} from "@/data-and-functions/constants/URLS";

export default {
    actions: {
        async fetchInventoryTypes(context){
            try {
                const res = await asyncRequest(dataArrays.inventoryTypes.URL);

                if (!res.ok) {
                    console.log('не получили данные типов инвентаря');
                    context.commit('updateErrorMessage', 'Не удалось получить данные.');
                } else {
                    console.log('получили данные типов инвентаря');

                    const types = await res.json();
                    context.commit('setInventoryTypes', types);
                }
            } catch (err) {
                console.error(err);
            }
        },
        async fetchCities(context){
            try {
                const res = await asyncRequest(dataArrays.cities.URL);

                if (!res.ok) {
                    console.log('не получили данные о городах');

                    context.commit('updateErrorMessage', 'Не удалось получить данные.');
                } else {
                    console.log('получили данные о городах');

                    const types = await res.json();
                    context.commit('setCities', types);
                }
            } catch (err) {
                console.error(err);
            }
        }
    },
    mutations: {
        setInventoryTypes(state, newTypesArray){
            state.inventoryTypes = newTypesArray;
            console.log(state.inventoryTypes);
        },
        setCities(state, newTypesArray){
            state.cities = newTypesArray;
            console.log(state.cities);
        }
    },
    state: {
        inventoryTypes: [],
        cities: [],
    },
    getters: {
        GET_INVENTORY_TYPES(state){
            return state.inventoryTypes;
        },
        GET_CITIES(state){
            return state.cities;
        },

    }
}