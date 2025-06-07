import CandidateListingView from "@/views/candidates/CandidateListingView.vue";
import CreateCandidateView from "@/views/candidates/CreateCandidateView.vue";
import UpdateCandidateView from "@/views/candidates/UpdateCandidateView.vue";
import CandidateDetailsView from "@/views/candidates/CandidateDetailsView.vue";

export default [
    {
        path: '/candidates',
        name: 'candidates',
        component: CandidateListingView,
        meta: {
            requiredAuth: true
        }
    },
    {
        path: '/candidates/create',
        name: 'create-candidate',
        component: CreateCandidateView,
        meta: {
            requiredAuth: true
        }
    },
    {
        path: '/candidates/edit/:id',
        name: 'edit-candidate',
        component: UpdateCandidateView,
        meta: {
            requiredAuth: true
        }
    }, {
        path: '/candidates/:id',
        name: 'candidate-details',
        component: CandidateDetailsView,
        meta: {
            requireAuth: true,
        }
    }

]