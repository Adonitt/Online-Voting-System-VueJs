import PartyListingView from "@/views/party/PartyListingView.vue";
import PartyDetailsView from "@/views/party/PartyDetailsView.vue";
import CreatePartyView from "@/views/party/CreatePartyView.vue";
import UpdatePartyView from "@/views/party/UpdatePartyView.vue";

export default [
    {
        path: '/party',
        name: 'party',
        component: PartyListingView,
        meta: {
            requireAuth: true,
        }
    },
    {
        path: 'party/:id',
        name: 'partyDetails',
        component: PartyDetailsView,
        meta: {
            requireAuth: true,
        }
    },
    {
        path: 'party/create',
        name: 'createParty',
        component: CreatePartyView,
        meta: {
            requireAuth: true,
        }
    }, {
        path: 'party/modify/:id',
        name: 'updateParty',
        component: UpdatePartyView,
        meta: {
            requireAuth: true,
        }
    }


]