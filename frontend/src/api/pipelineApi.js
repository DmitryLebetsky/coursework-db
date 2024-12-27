import apiClient from "../utils/axios";

const token = localStorage.getItem('token');

export const fetchPipelineData = async (jobId) => {
    const response = await apiClient.get(`/stages/${jobId}`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
};

export const addCandidate = async (candidateData) => {
    const response = await apiClient.post('/candidates', candidateData, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return response.data.candidate;
};

export const deleteCandidate = async (candidateId) => {
    await apiClient.delete(`/candidates/${candidateId}`, {
        headers: { Authorization: `Bearer ${token}` },
    });
};

export const addStage = async (stageData) => {
    const response = await apiClient.post('/stages', stageData, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return response.data.stage;
};

export const deleteStage = async (stageId) => {
    const response = await apiClient.delete(`/stages/${stageId}`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
};

export const updateCandidateStage = async (candidateId, stageId) => {
    await apiClient.post(
        '/candidate-stage/update',
        { candidateId, stageId },
        { headers: { Authorization: `Bearer ${token}` } }
    );
};
