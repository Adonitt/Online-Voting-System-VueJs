import {ref} from "vue";

export function useLoading() {
    const isLoading = ref(false)


    const withLoading = async (asyncFunction) => {
        try {
            isLoading.value = true
            await asyncFunction()
        } catch (error) {
            throw error
        } finally {
            isLoading.value = false
        }
    }

    return {
        isLoading, withLoading,
    }
}