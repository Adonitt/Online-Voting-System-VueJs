import UserList from "@/views/admin/UserListView.vue";
import AllVotesView from "@/views/vote/AllVotesView.vue";
import UpdateUserView from "@/views/admin/UpdateUserView.vue";
import {ROLES} from "@/composables/useAdministration.js";

export default [

    {
        path: 'admin/users',
        name: 'admin-users',
        component: UserList,
        meta: {
            requireAuth: true,
            roles: ROLES.ADMIN
        }
    },
    {
        path: 'admin/votes',
        name: 'admin-votes',
        component: AllVotesView,
        meta: {
            requireAuth: true,
            roles: ROLES.ADMIN
        }
    },
    {
        path: '/user/update/:id',
        name: 'user-update',
        component: UpdateUserView,
        meta: {
            requireAuth: true,
            roles: ROLES.ADMIN
        }
    }
]