import { useState } from "react";
import api from "../../services/api/axiosConfig";

const useUploadFile = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const uploadFile = async (file: File) => {
        // console.log(file);

        if (!file) {
            setError("No file selected");
            return null;
        }

        try {
            setLoading(true);
            const formData = new FormData();
            formData.append("file", file);

            const response = await api.post("/post/upload", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            return response.data.file;
        } catch (error) {
            console.error("Error uploading file:", error?.response?.data?.message);
            setError(error?.response?.data?.message || "Something went wrong");
            return null;
        } finally {
            setLoading(false);
        }
    };

    return { uploadFile, loading, error };
};

export default useUploadFile;
