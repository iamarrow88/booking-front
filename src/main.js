import {createApp} from 'vue'
import App from './App.vue'
import {createRouter, createWebHistory} from 'vue-router'
import StartPage from "@/components/StartPage";
import ResortPage from "@/components/ResortPage";
import LoginPage from "@/components/LoginPage.vue";
import BookingPage from "@/components/BookingPage.vue";
import BookingResortPage from "@/components/BookingResortPage.vue";
import EquipmentItem from "@/components/EquipmentItem.vue";
import PopUp from "@/components/PopUp.vue";
import AddItem from "@/components/addItem.vue";
import CreateResortPage from "@/components/CreateResortPage.vue";
import ManageResorts from "@/components/ManageResorts.vue";
import ResortItem from "@/components/ResortItem.vue";
import ModalWindow from "@/components/ModalWindow.vue";
import BookingItem from "@/components/BookingItem.vue";
import PaymentPage from "@/components/PaymentPage.vue";
import '@/main.css'
import ResultItemFromStartPage from "@/components/ResultItemFromStartPage.vue";

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {path: '/', component: StartPage},
        {path: '/resorts/:id', component: ResortPage},
        {path: '/login', component: LoginPage},
        {path: '/mybooking', component: BookingPage},
       // {path: '/:notFound(.*)', redirect: '/'},
        {path: '/resorts/bookings', component: BookingResortPage},
        {path: '/addEquipment', component: AddItem},
        {path: '/addResort', component: CreateResortPage},
        {path: '/resorts/manage', component: ManageResorts},
        {path: '/payment', component: PaymentPage},
    ]
})

const app = createApp(App);
    app.use(router);
    app.mount('#app');

app.component('EquipmentItem', EquipmentItem);
app.component('PopUp', PopUp);
app.component('AddItem', AddItem);
app.component('CreateResortPage', CreateResortPage);
app.component('ResortItem', ResortItem);
app.component('ModalWindow', ModalWindow);
app.component('BookingItem', BookingItem);
app.component('PaymentPage', PaymentPage);
app.component('ResultItemFromStartPage', ResultItemFromStartPage);

app.mixin({
    methods: {
        getTimeNumber(dateFull) {
            let timeNumber = (+dateFull.toString().split(':')[0].slice(-3) + 1).toString();
            timeNumber = timeNumber.length === 1 ? '0' + timeNumber : timeNumber;
            return timeNumber;
        },
    }
})


