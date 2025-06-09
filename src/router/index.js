import {createRouter, createWebHistory} from "vue-router";
import {useAuthStore} from "@/stores/authStore.js";
import AuthView from "@/views/auth/AuthView.vue";
import TheContainer from "@/components/ui/TheContainer.vue";
import ProfileView from "@/views/profile/ProfileView.vue";
import ChangePasswordView from "@/views/profile/ChangePasswordView.vue";
import RegisterView from "@/views/auth/RegisterView.vue";
import TheLayout from "@/components/ui/TheLayout.vue";
import profileRoute from "@/router/profileRoutes.js";
import profileRoutes from "@/router/profileRoutes.js";
import partyRoutes from "@/router/partyRoutes.js";
import candidateRoutes from "@/router/candidateRoutes.js";
import voteRoutes from "@/router/voteRoutes.js";
import ForgotPasswordView from "@/views/auth/ForgotPasswordView.vue";

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
        path: '/auth/register',
        name: 'register',
        component: RegisterView,
        meta: {
            requireAuth: false,
        }
    },
    {
        path: '/auth/forgot-password',
        name: 'forgot-password',
        component: ForgotPasswordView,
        meta: {
            requireAuth: false,
        }
    },
    {
        path: '/',
        component: TheLayout,
        meta:
            {
                requireAuth: true,
            }
        ,
        children: [
            {
                path: '',
                name: 'home',
                component: TheContainer,
            },
            ...profileRoutes,
            ...partyRoutes,
            ...candidateRoutes,
            ...voteRoutes
        ]
    },
]

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL), routes,
});

router.beforeEach((to, from) => {
    const authStore = useAuthStore();

    if (to.meta.roles && to.meta.roles.length > 0 && authStore.isLoggedIn) {
        const isAllowed = to.meta.roles.includes(authStore.loggedInUser?.role);

        if (!isAllowed) {
            return {name: 'home'}
        }
    }


    if (to.meta.requireAuth && !authStore.isLoggedIn) {
        return {
            name: 'login',
            query: {
                redirect: to.fullPath
            }
        };
    } else if (!to.meta.requireAuth && authStore.isLoggedIn) {
        return {name: 'home'};
    }

})


export default router;