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
    cities: {
        URL: 'api/cities',
        METHOD: 'GET',
    },
    inventoryTypes: {
        URL: 'api/inventories/types',
        METHOD: 'GET',
    },

    cityModel: {
        id: null,
        name: null,
    }
}

const resorts = {
    allResorts: {
        URL: 'api/resorts',
        METHOD: 'GET',
    },
    createResort: {
        URL: 'api/resorts',
        METHOD: 'POST',
    },
    updateResort: {
        URL: 'api/resorts',
        METHOD: 'PUT',
    },
    filteredResorts: {
        URL: 'api/resorts/filter',
        METHOD: 'POST',
    },
    allMyResorts: {
        URL: 'api/myresorts',
        METHOD: 'GET',
    },
    getInventoryInResort: {
        URL: 'api/resorts/inventories/',
        METHOD: 'GET',
    },
    getResortByID: {
        URL: 'api/resorts/',
        METHOD: 'GET',
    },
    deleteResortByID: {
        URL: 'api/resorts/',
        METHOD: 'DELETE',
    },

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
    getInventoriesByID: {
        URL: 'api/inventories/',
        METHOD: 'GET',
    },
    filteredInventories: {
        URL: 'api/inventories/filter',
        METHOD: 'POST',
    },
    updateInventoryImgByID: {
        URL: 'api/inventories/update_img/',
        METHOD: 'POST',
    },
    getInventoryImgByID: {
        URL: 'api/inventories/get_img/',
        METHOD: 'GET',
    },
    createInventory: {
        URL: 'api/inventories',
        METHOD: 'POST',
    },
    updateInventory: {
        URL: 'api/inventories',
        METHOD: 'PUT',
    },
    deleteInventoryByID: {
        URL: 'api/inventories/',
        METHOD: 'DELETE',
    },

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

const bookings = {
    getBookingByID: {
        URL: 'api/booking/',
        METHOD: 'GET',
    },
    getBookingInResortByID: {
        URL: 'api/resorts/bookings/',
        METHOD: 'GET',
    },
    getBookingByOwner: {
        URL: 'api/resorts/bookings',
        METHOD: 'GET',
    },
    createBooking: {
        URL: 'api/booking',
        METHOD: 'POST',
    },


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

const comments = {
    createComment: {
        URL: '/api/comments',
        METHOD: 'POST',
    },
    getCommentByID: {
        URL: '/api/comments/',
        METHOD: 'GET',
    },
    getCommentByResortID: {
        URL: '/api/resorts/comments/',
        METHOD: 'GET',
    },
    deleteCommentByID: {
        URL: '/api/comments/',
        METHOD: 'DELETE',
    },
    getCommentByInventoryID: {
        URL: '/api/inventories/comments/',
        METHOD: 'GET',
    },

    model: {
        id: 'Number',
        user_id: 'Number',
        inventory_id: 'Number',
        rating: 'Number',
        text: 'String',
        created_at: 'time'
    }
}

const headerAPI = {'Content-Type': 'application/json'};

const headerWithToken = {
    'Content-Type': 'application/json',
    'Accept': '*',
    'Authorization': 'Bearer '
}

export {user, dataArrays, resorts, inventory, bookings, headerAPI, headerWithToken, comments}
