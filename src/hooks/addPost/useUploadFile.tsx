import { useState } from "react";
import api from "../../services/api/axiosConfig";

const useUploadFile = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [uploadProgress, setUploadProgress] = useState<number>(0);


    const uploadFile = async (file: File) => {
        // //(file);

        if (!file) {
            setError("No file selected");
            return null;
        }
        setUploadProgress(30)

        try {
            setUploadProgress(0)
            setLoading(true);
            const formData = new FormData();
            formData.append("file", file);
            setUploadProgress(60)
            const response = await api.post("/post/upload", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
                
            });
            setUploadProgress(100)

            return response.data.file;
        } catch (error) {
            console.error("Error uploading file:", error?.response?.data?.message);
            setError(error?.response?.data?.message || "Something went wrong");
            return null;
        } finally {
            setLoading(false);
            setUploadProgress(0);
        }
    };

    return { uploadFile, loading, error, uploadProgress };
};

export default useUploadFile;
