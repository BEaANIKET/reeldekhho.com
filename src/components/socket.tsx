import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { io } from "socket.io-client";
import { setSocket } from "../store/slices/socketSlices";

const Socketwindow = () => {
    const user = useSelector((state) => state?.auth?.user);
    const dispatch = useDispatch();

    useEffect(() => {
        if (!user?._id) {
            console.error("User is not authenticated. Socket connection skipped.");
            return;
        }

        let socket;

        try {
            socket = io(import.meta.env.VITE_APP_SOCKET_URL, {
                query: { userId: user._id },
                transports: ["websocket"],
            });

            dispatch(setSocket(socket));

            socket.on("connect", () => {
                console.log("Connected to the server");
            });

            socket.on("connect_error", (error) => {
                console.error("Connection error:", error.message || error);
            });

            socket.on("disconnect", (reason) => {
                console.warn("Socket disconnected:", reason);
            });
        } catch (error) {
            console.error("Error initializing socket:", error.message || error);
        }

        return () => {
            if (socket) {
                socket.disconnect();
                console.log("Socket disconnected");
            }
        };
    }, [dispatch, user?._id]);

    return null;
};

export default Socketwindow;
