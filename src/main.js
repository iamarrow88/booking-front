import {createApp} from 'vue'
import App from './App.vue'
import {createRouter, createWebHistory} from 'vue-router'
import startPage from "@/components/StartPage";
import ResortPage from "@/components/ResortPage";
import LoginPage from "@/components/LoginPage.vue";

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {path: '/', component: startPage},
        {path: '/resorts/:id', component: ResortPage},
        {path: '/login', component: LoginPage},
    ]
})

createApp(App)
    .use(router)
    .mount('#app')
