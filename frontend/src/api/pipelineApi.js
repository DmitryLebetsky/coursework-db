import axios from 'axios';

const token = localStorage.getItem('token');

export const fetchPipelineData = async (jobId) => {
    const response = await axios.get(`/api/stages/${jobId}`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
};

export const addCandidate = async (candidateData) => {
    const response = await axios.post('/api/candidates', candidateData, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return response.data.candidate;
};

export const deleteCandidate = async (candidateId) => {
    await axios.delete(`/api/candidates/${candidateId}`, {
        headers: { Authorization: `Bearer ${token}` },
    });
};

export const addStage = async (stageData) => {
    const response = await axios.post('/api/stages', stageData, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return response.data.stage;
};

export const deleteStage = async (stageId) => {
    const response = await axios.delete(`/api/stages/${stageId}`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
};

export const updateCandidateStage = async (candidateId, stageId) => {
    await axios.post(
        '/api/candidate-stage/update',
        { candidateId, stageId },
        { headers: { Authorization: `Bearer ${token}` } }
    );
};
