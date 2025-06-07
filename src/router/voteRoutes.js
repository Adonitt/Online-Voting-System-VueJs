import CastVoteView from "@/views/vote/CastVoteView.vue";
import MyVoteDetails from "@/views/vote/MyVoteDetails.vue";

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
    }
]