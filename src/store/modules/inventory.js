export default {
    actions: {
        async fetchInventoryTypes(context){
            try {
                const res = await fetch('/api/inventories/types', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    },
                });

                if (!res.ok) {
                    this.errorMessage = "Invalid data provided, please try again";
                } else {
                    const types = await res.json();
                    context.commit('getInventoryTypes', types)
                    console.log(this.$store.state.inventoryTypes)
                }
            } catch (err) {
                console.error(err);
            }
        }
    },
    mutations: {
        getInventoryTypes(state, newTypesArray){
            state.inventoryTypes = newTypesArray;
        }
    },
    state: {
        inventoryTypes: [],
    },
    getters: {

    }
}