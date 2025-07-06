import {createRouter, createWebHistory} from "vue-router";
import {useAuthStore} from "@/stores/authStore.js"; // Correct import path
import AuthView from "@/views/auth/AuthView.vue";
import TheContainer from "@/components/ui/TheContainer.vue";
import ProfileView from "@/views/profile/ProfileView.vue";
import ChangePasswordView from "@/views/profile/ChangePasswordView.vue";
import RegisterView from "@/views/auth/RegisterView.vue";
import TheLayout from "@/components/ui/TheLayout.vue";
import partyRoutes from "@/router/partyRoutes.js";
import candidateRoutes from "@/router/candidateRoutes.js";
import voteRoutes from "@/router/voteRoutes.js"; // This might be for user-specific votes, not admin
import ForgotPasswordView from "@/views/auth/ForgotPasswordView.vue";

// *** EXISTING ADMIN IMPORTS ***
import UserList from "@/views/admin/UserListView.vue"; // Your existing Admin Users List component
import profileRoutes from "@/router/profileRoutes.js"; // Ensure this is not a duplicate import if already used

import AllVotesView from "@/views/vote/AllVotesView.vue";
import userRoutes from "@/router/userRoutes.js";
import VoteService from "@/services/voteService.js";
import Citizens from "@/views/Citizens.vue";

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
        path: '/auth/citizens',
        name: 'citizens',
        component: Citizens,
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
            ...voteRoutes,
            ...userRoutes
        ]
    },
];

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes,
});

router.beforeEach(async (to, from) => {
    const authStore = useAuthStore();

    if (to.meta.roles && to.meta.roles.length > 0 && authStore.isLoggedIn) {
        const isAllowed = to.meta.roles.includes(authStore.loggedInUser?.role);

        if (!isAllowed) {
            console.warn('Access Denied: You do not have the required role for this page.');
            return {name: 'home'}
        }
    }


    if (to.meta.checkDeadline) {
        try {
            const res = await VoteService.getVotingDates();
            const deadline = new Date(res.partyCreationDeadline);
            const now = new Date();

            if (now > deadline) {
                console.warn('Party creation deadline has passed.');
                return {
                    name: 'home',
                    query: {error: 'party-deadline-passed'}
                };
            }
        } catch (e) {
            console.error("Error fetching deadline:", e);
            return {name: 'home'};
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

    return true;
});


export default router;