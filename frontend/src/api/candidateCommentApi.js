import axios from 'axios';

const token = localStorage.getItem('token');

export const fetchCommentsByCandidate = async (candidateId) => {
    const response = await axios.get(`/api/candidate-comments/${candidateId}`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
};

export const addComment = async (candidateId, comment) => {
    const response = await axios.post(
        '/api/candidate-comments',
        { candidateId, comment },
        { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data.newComment;
};
