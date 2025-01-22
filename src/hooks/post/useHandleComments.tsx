import { useEffect, useState } from "react";
import api from "../../services/api/axiosConfig";

const useHandleComment = (postId) => {
    const [comments, setComments] = useState([]);

    const getComment = async () => {
        try {
            const response = await api.get(`/post/getcomment?postId=${postId}`);
            setComments(response.data.comments);
        } catch (error) {
            console.error("Error fetching comments:", error);
        }
    };

    const createComment = async (commentText) => {
        try {
            const response = await api.post(`/post/addcomment`, {
                text: commentText,
                postId: postId,
            });
            // console.log(response.data.comment);

            setComments([response.data.comment, ...comments]);
        } catch (error) {
            console.error("Error creating comment:", error);
        }
    };

    const deleteComment = async (commentId) => {
        try {
            await api.delete(`/post/deletecomment?commentId=${commentId}`);
            setComments(comments.filter((comment) => comment._id !== commentId));
        } catch (error) {
            console.error("Error deleting comment:", error);
        }
    };

    useEffect(() => {
        if (!comments?.length) {
            getComment();
        }
    }, [postId]);

    return {
        getComment,
        createComment,
        deleteComment,
        comments,
    };
};

export default useHandleComment;
