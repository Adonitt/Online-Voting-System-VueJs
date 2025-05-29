import ProfileView from "@/views/profile/ProfileView.vue";
import ChangePasswordView from "@/views/profile/ChangePasswordView.vue";

export default [
    {
        path: '/my-profile',
        name: 'my-profile',
        component: ProfileView,
        meta: {
            requireAuth: true
        }
    },
    {
        path: "/my-profile/change-password",
        name: 'change-password',
        component: ChangePasswordView,
        meta: {
            requireAuth: true,
        }
    },
]