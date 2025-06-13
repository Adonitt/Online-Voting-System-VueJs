// src/stores/enumStore.ts
import {defineStore} from 'pinia'
import {computed, ref} from 'vue'
import EnumService from '@/services/enumService'

export const useEnumStore = defineStore('enum', () => {
    const nationalities = ref([])
    const cities = ref([])


    const loadNationalities = async () => {
        try {
            const data = await EnumService.getNationalities()
            console.log('Fetched nationalities:', data)

            if (Array.isArray(data)) {
                nationalities.value = data.map(n => ({
                    label: n.charAt(0) + n.slice(1).toLowerCase(), // "ALBANIAN" → "Albanian"
                    value: n
                }))
            } else {
                console.error('Expected array but got:', data)
            }
        } catch (err) {
            console.error('Error fetching nationalities:', err)
        }
    }


    const loadCities = async () => {
        try {
            const data = await EnumService.getCities()
            if (Array.isArray(data)) {
                cities.value = data.map(n => ({
                    label: n.charAt(0) + n.slice(1).toLowerCase(),
                    value: n
                }))
            } else {
                console.error('Expected array but got:', data)
            }
        } catch (error) {
            console.error(error)
        }
    }
    const nationalitiesForDropdown = computed(() => {
        return nationalities.value
    })

    const citiesForDropdown = computed(() => {
        return cities.value
    })

    return {
        nationalities,
        loadNationalities,
        nationalitiesForDropdown,
        loadCities,
        citiesForDropdown
    }
})
