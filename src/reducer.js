export default function reducer(state = {}, action) {
    if (action.type == "GET_FRIENDS_WANNABES") {
        state = Object.assign({}, state, {
            friendsWannabes: action.friendsWannabes,
        });
    } else if (action.type == "ACCEPT") {
        const friendsWannabes = {
            ...state.friendsWannabes,
            accepted: action.accepted,
        };
        return { ...state, friendsWannabes };
    } else if (action.type == "DELETE_FRIEND") {
        const friendsWannabes = {
            ...state.friendsWannabes,
            friendsWannabes: action.friendsWannabes,
        };
        return { ...state, friendsWannabes };
    }

    return state;
}
