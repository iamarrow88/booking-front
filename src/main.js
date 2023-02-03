import {createApp} from 'vue'
import App from './App.vue'
import {createRouter, createWebHistory} from 'vue-router'
import startPage from "@/components/StartPage";
import ResortPage from "@/components/ResortPage";

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {path: '/', component: startPage},
        {path: '/resorts/:id', component: ResortPage}
    ]
})

createApp(App)
    .use(router)
    .mount('#app')
