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
    ]
})

const app = createApp(App);
    app.use(router);
    app.mount('#app');

app.component('EquipmentItem', EquipmentItem);
app.component('PopUp', PopUp);
app.component('AddItem', AddItem);
app.component('CreateResortPage', CreateResortPage);
app.component('ManageResorts', ManageResorts);
