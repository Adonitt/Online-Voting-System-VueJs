import {createRouter, createWebHistory} from "vue-router";
import {useAuthStore} from "@/stores/authStore.js"; // Correct import path
import AuthView from "@/views/auth/AuthView.vue";
import TheContainer from "@/components/ui/TheContainer.vue";
import ProfileView from "@/views/profile/ProfileView.vue";
import ChangePasswordView from "@/views/profile/ChangePasswordView.vue";
import RegisterView from "@/views/auth/RegisterView.vue";
import TheLayout from "@/components/ui/TheLayout.vue";
import profileRoute from "@/router/profileRoutes.js"; // This might be a duplicate, assuming 'profileRoutes' is used
import partyRoutes from "@/router/partyRoutes.js";
import candidateRoutes from "@/router/candidateRoutes.js";
import voteRoutes from "@/router/voteRoutes.js";
import ForgotPasswordView from "@/views/auth/ForgotPasswordView.vue";

// *** NEW IMPORT ***
import UserList from "@/views/admin/UserListView.vue";
import profileRoutes from "@/router/profileRoutes.js"; // Path to your new component

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
            ...voteRoutes,

            {
                path: 'admin/users',
                name: 'admin-users',
                component: UserList,
                meta: {
                    requireAuth: true,
                    roles: ['ADMIN']
                }
            }
        ]
    },
];

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes,
});

router.beforeEach((to, from) => {
    const authStore = useAuthStore();

    // Check for role-based access before authentication
    if (to.meta.roles && to.meta.roles.length > 0 && authStore.isLoggedIn) {
        // Your existing role check logic
        const isAllowed = to.meta.roles.includes(authStore.loggedInUser?.role);

        if (!isAllowed) {
            // alert('Access Denied: You do not have the required role.'); // Use a better notification system
            return {name: 'home'} // Redirect to home or another suitable page
        }
    }


    // Check for general authentication
    if (to.meta.requireAuth && !authStore.isLoggedIn) {
        return {
            name: 'login',
            query: {
                redirect: to.fullPath
            }
        };
    } else if (!to.meta.requireAuth && authStore.isLoggedIn) {
        // If not required auth but user is logged in, redirect to home
        return {name: 'home'};
    }

    // If none of the above, proceed
    return true; // Explicitly return true to allow navigation
});


export default router;