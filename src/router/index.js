import {createRouter, createWebHistory} from "vue-router";
import {useAuthStore} from "@/stores/authStore.js";
import AuthView from "@/views/auth/AuthView.vue";
import TheContainer from "@/components/ui/TheContainer.vue";

const routes = [
    {
        path: '/auth/login',
        name: 'login',
        component: AuthView,
        meta: {
            requireAuth: false,
        }
    },
    {
        path: '/',
        name: 'home',
        component: TheContainer,
        meta: {
            requireAuth: true,
        }
    }
]

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL), routes,
});

router.beforeEach((to, from) => {
    const authStore = useAuthStore();

    if (to.meta.requireAuth && !authStore.isLoggedIn) {
        return {
            name: 'login',
            query: {
                redirect: to.fullPath
            }
        };
    } else if (!to.meta.requireAuth && authStore.isLoggedIn) {
        return { name: 'home' };
    }

})


export default router;