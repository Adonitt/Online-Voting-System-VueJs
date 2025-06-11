import {defineStore} from "pinia";
import {computed, ref} from "vue";
import client from "@/helpers/client.js"; // Assuming this is your configured Axios instance
import {jwtDecode} from "jwt-decode";

export const useAuthStore = defineStore("auth", () => {
        const token = ref(localStorage.getItem("token") || null);
        // We'll store the decoded user payload here for easy access
        const user = computed(() => (token.value ? jwtDecode(token.value) : null));

        const login = async (userData) => { // Renamed 'user' to 'userData' for clarity
            try {
                const response = await client.post('auth/login', userData);

                if (response.data && response.data.token) {
                    token.value = response.data.token;
                    localStorage.setItem("token", token.value);
                    // The 'user' computed property will automatically update here
                    // assuming the token contains the user's role.
                } else {
                    console.error("Login response did not contain a token:", response);
                    throw new Error("Login failed: No token received.");
                }
            } catch (error) {
                console.error("Login failed:", error.response?.data || error.message);
                throw error; // Re-throw to handle in the component
            }
        }

        const logout = () => {
            token.value = null;
            localStorage.removeItem("token");
        }

        const isLoggedIn = computed(() => {
            return token.value !== null
        })

        const loggedInUser = computed(() => { // Keep this as it was
            return token.value ? jwtDecode(token.value) : null;
        })

        // *** NEW: Computed property to check for ADMIN role ***
        const isAdmin = computed(() => {
            // Assuming your JWT payload has a 'role' field, e.g., { ..., "role": "ADMIN" }
            return user.value && user.value.role === 'ADMIN';
        });


        return {login, isLoggedIn, loggedInUser, logout, token, isAdmin} // Export token and isAdmin
    }
);