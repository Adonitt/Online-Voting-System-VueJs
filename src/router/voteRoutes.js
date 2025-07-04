import CastVoteView from "@/views/vote/CastVoteView.vue";
import MyVoteDetails from "@/views/vote/MyVoteDetails.vue";
import CandidateResultsView from "@/views/vote/CandidateResultsView.vue";

export default [
    {
        path: '/cast-vote',
        name: 'cast-vote',
        component: CastVoteView,
        meta: {
            requireAuth: true,
        }
    },
    {
        path: '/my-vote/details/:id',
        name: 'my-vote-details',
        component: MyVoteDetails,
        meta: {
            requireAuth: true,
        }
    },
    {
        path: '/results/candidate',
        name: 'candidate-results',
        component: CandidateResultsView,
        meta: {
            requireAuth: true,
        }
    },

]