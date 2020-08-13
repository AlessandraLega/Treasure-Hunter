import axios from "./axios";

export async function getFriendsWannabes() {
    const { data } = await axios.get("/friends-wannabes");
    console.log("data", data);
    return {
        type: "GET_FRIENDS_WANNABES",
        friendsWannabes: data,
    };
}

export async function accept(id) {
    await axios.post("/update-friendship", {
        button: "accept request",
        otherId: id,
    });
    return {
        type: "ACCEPT",
        id,
    };
}

export async function deleteFriend(id) {
    await axios.post("/update-friendship", {
        button: "delete friend",
        otherId: id,
    });
    return {
        type: "DELETE_FRIEND",
        id,
    };
}

export function chatMessages(lastTen) {
    console.log("lastTen in action :", lastTen);
    return {
        type: "GET_LAST_TEN",
        lastTen,
    };
}

export function newMessage(newMessage) {
    console.log("newMessage in action:", newMessage);
    return {
        type: "NEW_MESSAGE",
        newMessage,
    };
}
