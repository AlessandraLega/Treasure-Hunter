export default function reducer(state = {}, action) {
    if (action.type == "GET_FRIENDS_WANNABES") {
        state = Object.assign({}, state, {
            friendsWannabes: action.friendsWannabes,
        });
    } else if (action.type == "ACCEPT") {
        state = {
            ...state,
            friendsWannabes: state.friendsWannabes.map((person) => {
                if (person.id == action.id) {
                    return { ...person, accepted: true };
                } else {
                    return person;
                }
            }),
        };
    } else if (action.type == "DELETE_FRIEND") {
        state = {
            ...state,
            friendsWannabes: state.friendsWannabes.filter((person) => {
                return person.id != action.id;
            }),
        };
    } else if (action.type == "GET_LAST_TEN") {
        state = {
            ...state,
            lastTen: action.lastTen,
        };
    } else if (action.type == "NEW_MESSAGE") {
        state = {
            ...state,
            lastTen: [...state.lastTen, action.newMessage],
        };
    } else if (action.type == "NEW_REQUEST") {
        state = {
            ...state,
            requestNum: action.requestNum,
        };
    }

    return state;
}
