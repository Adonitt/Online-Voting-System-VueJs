import {defineStore} from "pinia";
import {computed, ref} from "vue";
import PartyService from "@/services/partyService.js";

export const usePartyStore = defineStore(
    'party', () => {

        const parties = ref([])

        const getParties = async () => {
            const response = await PartyService.getAllParties()
            console.log(response)
            if (response) {
                parties.value = response
            }
        }


        const partiesForDropdown = computed(() => {
            console.log("Parties",parties.value)
            return parties.value.map(party => {
                return {
                    label: party.name,
                    value: party.id
                }
            })
        })


        return {getParties, partiesForDropdown}
    }
)