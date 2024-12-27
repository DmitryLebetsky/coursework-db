import apiClient from "../utils/axios";

const token = localStorage.getItem('token');

export const fetchCommentsByCandidate = async (candidateId) => {
    const response = await apiClient.get(`/candidate-comments/${candidateId}`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
};

export const addComment = async (candidateId, comment) => {
    const response = await apiClient.post(
        '/candidate-comments',
        { candidateId, comment },
        { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data.newComment;
};
