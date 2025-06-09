import {useAuthStore} from "@/stores/authStore.js";
import {computed} from "vue";

export const ROLES = {
    ADMIN: 'ADMIN',
    USER: 'USER'
}


export function useAdministration() {
    const authStore = useAuthStore()
    const isAdmin = computed(() => authStore.loggedInUser?.role === ROLES.ADMIN)
    return {isAdmin}
}