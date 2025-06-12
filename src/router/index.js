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

// *** NEW IMPORT FOR ALL VOTES VIEW ***
import AllVotesView from "@/views/admin/AllVotesView.vue"; // Path to your new AllVotesView component

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
            // Assuming 'voteRoutes' is for something different (e.g., casting a vote for a user),
            // and 'admin-votes' is for listing all votes as an admin.
            ...voteRoutes,

            // *** EXISTING ROUTE FOR ADMIN USERS LIST ***
            {
                path: 'admin/users', // This makes the full path /admin/users
                name: 'admin-users',
                component: UserList,
                meta: {
                    requireAuth: true,
                    roles: ['ADMIN'] // Only ADMIN role can access this
                }
            },
            // *** NEW ROUTE FOR ADMIN ALL VOTES LIST ***
            {
                path: 'admin/votes', // This makes the full path /admin/votes
                name: 'admin-votes', // A unique name for this route
                component: AllVotesView, // Your newly created AllVotesView component
                meta: {
                    requireAuth: true,
                    roles: ['ADMIN'] // Only ADMIN role can access this
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
            // Using a better notification system than alert is recommended.
            // For now, redirect to home.
            console.warn('Access Denied: You do not have the required role for this page.');
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
        // This prevents logged-in users from accessing login/register/forgot password pages.
        return {name: 'home'};
    }

    // If none of the above conditions met, proceed with navigation
    return true; // Explicitly return true to allow navigation
});


export default router;