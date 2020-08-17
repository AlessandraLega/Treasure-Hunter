import * as io from "socket.io-client";
import { chatMessages, newMessage, newRequest } from "./actions";

export let socket;

export const init = (store) => {
    if (!socket) {
        socket = io.connect();

        socket.on("chatMessages", (msgs) => store.dispatch(chatMessages(msgs)));

        socket.on("chatMessage", (msg) => store.dispatch(newMessage(msg)));

        socket.on("requestNum", (requestNum) =>
            store.dispatch(newRequest(requestNum))
        );
    }
};
