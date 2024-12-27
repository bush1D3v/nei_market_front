import {io, type Socket} from "socket.io-client";
import type {SocketEvents} from "@/types/Socket/SocketEvents";

const SOCKET_HOST = import.meta.env.VITE_SOCKET_HOST;
const SOCKET_PORT = import.meta.env.VITE_SOCKET_PORT;

const socket: Socket<SocketEvents> = io(`${SOCKET_HOST}:${SOCKET_PORT}`, {
	withCredentials: true,
	extraHeaders: {
		"Content-Type": "application/json; charset=utf-8",
		Accept: "application/json",
	},
});

export default socket;
