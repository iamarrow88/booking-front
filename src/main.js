import {createApp} from 'vue'
import App from './App.vue'
import {createRouter, createWebHistory} from 'vue-router'
import BookingPage from "@/components/pages/bookings/BookingPage.vue";
import BookingResortPage from "@/components/pages/bookings/BookingResortPage.vue";
import PaymentPage from "@/components/pages/payment/PaymentPage.vue";
import ResortPage from "@/components/pages/start-page/ResortPage.vue";
import StartPage from "@/components/pages/start-page/StartPage.vue";
import RegistrationBlock from "@/components/pages/user/RegistrationBlock.vue";
import UserPage from "@/components/pages/user/UserPage.vue";

import BookingItem from "@/components/items/bookings/BookingItem.vue";
import InventoryCard from "@/components/items/equipments/InventoryCard.vue";
import SearchEquipmentItem from "@/components/items/equipments/SearchEquipmentItem.vue";
import ResortDescritption from "@/components/items/resorts/ResortDescritption.vue";
import ResortItem from "@/components/items/resorts/ResortItem.vue";
import ResultItemFromStartPage from "@/components/items/start-page/ResultItemFromStartPage.vue";

import ConfirmWindow from "@/components/blocks/modal/ConfirmWindow.vue";
import SuccessWindow from "@/components/blocks/modal/SuccessWindow.vue";
import CreateResortBlock from "@/components/blocks/resorts/CreateResortBlock.vue";
import ManageResortCard from "@/components/blocks/resorts/ManageResortCard.vue";
import ReviewBlock from "@/components/blocks/start-page/ReviewBlock.vue";
import AuthorizationPage from "@/components/blocks/user/AuthorizationPage.vue";
import LoginBlock from "@/components/blocks/user/LoginBlock.vue";

import '@/main.css'
import store from "@/store";


import StarsRate from "@/components/UI/StarsRate.vue";
import InformationWindow from "@/components/blocks/modal/InformationWindow.vue";
import CreateComment from "@/components/UI/CreateComment.vue";
import InventoryManagementPage from "@/components/pages/inventory/InventoryManagementPage.vue";
import ModalWindow from "@/components/blocks/modal/ModalWindow.vue";
import ChartPage from "@/components/pages/charts/ChartPage.vue";



const router = createRouter({
    history: createWebHistory(),
    routes: [
        {path: '/', component: StartPage},
        {path: '/resorts/:id', component: ResortPage},
        {path: '/login', component: AuthorizationPage},
        {path: '/user/bookings', component: BookingPage, name: "UserBookings"},
        // {path: '/:notFound(.*)', redirect: '/'},
        {path: '/resorts/bookings', component: BookingResortPage},
        {path: '/add-equipment', component: InventoryCard},
        {path: '/resorts/add-resort', component: CreateResortBlock},
        {path: '/resorts/manage', component: ManageResortCard},
        {path: '/payment', component: PaymentPage},
        {path: '/profile', component: UserPage},
        {path: '/equipment/manage', component: InventoryManagementPage},
        {path: '/charts', component: ChartPage},
    ]
})
const app = createApp(App);
app.use(router);
app.use(store);
app.mount('#app');

app.component('SearchEquipmentItem', SearchEquipmentItem);
app.component('ConfirmWindow', ConfirmWindow);
app.component('InventoryCard', InventoryCard);
app.component('CreateResortBlock', CreateResortBlock);
app.component('ResortItem', ResortItem);
app.component('SuccessWindow', SuccessWindow);
app.component('InformationWindow', InformationWindow);
app.component('BookingItem', BookingItem);
app.component('PaymentPage', PaymentPage);
app.component('ResultItemFromStartPage', ResultItemFromStartPage);
app.component('ResortDescritption', ResortDescritption);
app.component('ReviewBlock', ReviewBlock);
app.component('StarsRate', StarsRate);
app.component('CreateComment', CreateComment);
app.component('AuthorizationPage', AuthorizationPage);
app.component('LoginBlock', LoginBlock);
app.component('RegistrationBlock', RegistrationBlock);
app.component('InventoryManagementPage', InventoryManagementPage);
app.component('ModalWindow', ModalWindow);
app.component('ChartPage', ChartPage);


app.mixin({
    methods: {
        getTimeNumber(dateFull) {
            let timeNumber = (+dateFull.toString().split(':')[0].slice(-3) + 1).toString();
            timeNumber = timeNumber.length === 1 ? '0' + timeNumber : timeNumber;
            return timeNumber;
        },
    }
})


