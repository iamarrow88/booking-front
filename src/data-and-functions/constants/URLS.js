const user = {
    register: {
        URL: 'api/user/register',
        METHOD: 'POST',
    },
    login: {
        URL: 'api/user/login',
        METHOD: 'POST',
    },
    bookings: {
        URL: 'api/user/bookings',
        METHOD: 'GET',
    },
    getUser: {
        URL: 'api/user',
        METHOD: 'GET',
    },
    updateUser: {
        URL: 'api/user',
        METHOD: 'PUT',
    },
    deleteUser: {
        URL: 'api/user',
        METHOD: 'DELETE',
    },


    userModel: {
        id: null,
        first_name: null,
        surname: null,
        middle_name: null,
        email: null,
        password: null,
        phone: null,
        role_id: null,
        token: null,
    }
}

const dataArrays = {
    cities: ['api/cities', 'GET'],
    inventoryTypes: ['api/inventories/types', 'GET'],

    cityModel: {
        id: null,
        name: null,
    }
}

const resorts = {
    allResorts: ['api/resorts', 'GET'],
    createResort: ['api/resorts', 'POST'],
    updateResort: ['api/resorts', 'PUT'],
    filteredResorts: ['api/resorts/filter', 'POST'],
    allMyResorts: ['api/myresorts', 'GET'],
    getInventoryInResort: ['api/resorts/inventories/', 'GET'],
    getResortByID: ['api/resorts/', 'GET'],
    deleteResortByID: ['api/resorts/', 'DELETE'],

    resortModel: {
        id: null,
        name: null,
        city_id: null,
        owner_id: null,
        description: null,
        address: null,
    }
}

const inventory = {
    getInventoriesByID: ['api/inventories/', 'GET'],
    filteredInventories: ['api/inventories/filter', 'POST'],
    updateInventoryImgByID: ['api/inventories/update_img/', 'POST'],
    getInventoryImgByID: ['api/inventories/get_img/', 'GET'],
    createInventory: ['api/inventories', 'POST'],
    updateInventory: ['api/inventories', 'PUT'],
    deleteInventoryByID: ['api/inventories/', 'DELETE'],


    itemModel: {
        id: null,
        type_id: null,
        resort_id: null,
        price: null,
        photo: null,
    },

    itemTypeModel: {
        id: null,
        name: null,
    },
    filterModel: {
        resort_id: null,
        type_id: null,
        start_time: null,
        end_time: null,
    },

    imgModel: {
        id: null,
        inventory_id: null,
        name: null,
        bytes: null,
    }
}

const bookings ={
    getBookingByID: ['api/booking/', 'GET'],
    getBookingInResortByID: ['api/resorts/bookings/', 'GET'],
    getBookingByOwner: ['api/resorts/bookings', 'GET'],
    createBooking: ['api/booking', 'POST'],

    model: {
        id: null,
        user_id: null,
        inventory_id: null,
        inventory: null,
        resort: null,
        total_price: null,
        start_time: null,
        end_time: null,
    }
}

const headerAPI = {'Content-Type': 'application/json'};

const headerWithToken = {
    'Content-Type': 'application/json',
    'Accept': '*',
    'Authorization': 'Bearer '
}

export { user, dataArrays, resorts, inventory, bookings, headerAPI, headerWithToken }