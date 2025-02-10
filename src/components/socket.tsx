import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { io, Socket } from "socket.io-client";
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
                transports: ["websocket"],
            });

            dispatch(setSocket(socket));

            socket.on("connect", () => {
                socket.emit("registerUser", { userId: user._id });
            });

            socket.on("connect_error", (error) => {
                console.error("Connection error:", error.message || error);
            });

            socket.on('newMessage2', (data) => {
                //(data);

            })

            socket.on("disconnect", (reason) => {
                console.warn("Socket disconnected:", reason);
            });
        } catch (error) {
            console.error("Error initializing socket:", error.message || error);
        }

        return () => {
            if (socket) {
                socket.disconnect();
                //("Socket disconnected");
            }
        };
    }, [dispatch, user?._id, user]);

    return null;
};

export default Socketwindow;
