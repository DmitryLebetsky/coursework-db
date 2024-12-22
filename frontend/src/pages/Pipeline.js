import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { DragDropContext } from 'react-beautiful-dnd';
import {
    fetchPipelineData,
    addCandidate,
    deleteCandidate,
    addStage,
    deleteStage,
    updateCandidateStage,
} from '../api/pipelineApi';
import Stage from '../components/Stage';

function Pipeline() {
    const { jobId } = useParams();
    const [pipelineData, setPipelineData] = useState({ stages: [], candidates: {} });
    const [newStageName, setNewStageName] = useState('');
    const [message, setMessage] = useState('');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [resume, setResume] = useState('');

    useEffect(() => {
        const loadPipelineData = async () => {
            try {
                const data = await fetchPipelineData(jobId);
                const groupedCandidates = {};
                data.stages.forEach((stage) => {
                    groupedCandidates[stage.id] = data.candidates.filter(
                        (candidate) => candidate.stage_id === stage.id
                    );
                });
                setPipelineData({ stages: data.stages, candidates: groupedCandidates });
            } catch (error) {
                console.error('Error fetching pipeline data:', error);
            }
        };
        loadPipelineData();
    }, [jobId]);

    const handleAddCandidate = async (e) => {
        e.preventDefault();
        try {
            const newCandidate = await addCandidate({ name, email, resume, vacancyId: jobId });
            setPipelineData((prev) => ({
                ...prev,
                candidates: {
                    ...prev.candidates,
                    [newCandidate.stage_id]: [
                        ...(prev.candidates[newCandidate.stage_id] || []),
                        newCandidate,
                    ],
                },
            }));
            setName('');
            setEmail('');
            setResume('');
            setMessage('Candidate added successfully!');
        } catch (error) {
            console.error('Error adding candidate:', error);
            setMessage('Error adding candidate.');
        }
    };

    const handleDeleteCandidate = async (candidateId, stageId) => {
        try {
            await deleteCandidate(candidateId);
            setPipelineData((prev) => {
                const updatedCandidates = prev.candidates[stageId].filter(
                    (candidate) => candidate.candidate_id !== candidateId
                );
                return {
                    ...prev,
                    candidates: {
                        ...prev.candidates,
                        [stageId]: updatedCandidates,
                    },
                };
            });
            setMessage('Candidate deleted successfully.');
        } catch (error) {
            console.error('Error deleting candidate:', error);
            setMessage('Error deleting candidate.');
        }
    };

    const handleAddStage = async () => {
        try {
            const newStage = await addStage({ name: newStageName, jobId });
            setPipelineData((prev) => ({
                ...prev,
                stages: [...prev.stages, newStage],
                candidates: {
                    ...prev.candidates,
                    [newStage.id]: [],
                },
            }));
            setNewStageName('');
            setMessage('Stage added successfully!');
        } catch (error) {
            console.error('Error adding stage:', error);
            setMessage('Error adding stage.');
        }
    };

    const handleDeleteStage = async (stageId) => {
        try {
            const { deletedStage, noStage, updatedCandidates } = await deleteStage(stageId);
            setPipelineData((prev) => {
                const updatedStages = prev.stages.filter((stage) => stage.id !== deletedStage.id);
                if (!updatedStages.some((stage) => stage.id === noStage.id)) {
                    updatedStages.push(noStage);
                }
                const updatedCandidatesByStage = { ...prev.candidates };
                updatedCandidatesByStage[noStage.id] = [
                    ...(updatedCandidatesByStage[noStage.id] || []),
                    ...updatedCandidates,
                ];
                delete updatedCandidatesByStage[stageId];
                return { stages: updatedStages, candidates: updatedCandidatesByStage };
            });
            setMessage('Stage deleted successfully!');
        } catch (error) {
            console.error('Error deleting stage:', error);
            setMessage('Error deleting stage.');
        }
    };

    const handleDragEnd = async (result) => {
        const { source, destination } = result;
        if (!destination) return;
        const sourceStageId = String(source.droppableId);
        const destinationStageId = String(destination.droppableId);
        if (sourceStageId === destinationStageId) return;
        const draggedCandidate = pipelineData.candidates[sourceStageId][source.index];
        try {
            await updateCandidateStage(draggedCandidate.candidate_id, destinationStageId);
            const updatedSource = Array.from(pipelineData.candidates[sourceStageId]);
            updatedSource.splice(source.index, 1);
            const updatedDestination = Array.from(pipelineData.candidates[destinationStageId] || []);
            updatedDestination.splice(destination.index, 0, draggedCandidate);
            setPipelineData({
                ...pipelineData,
                candidates: {
                    ...pipelineData.candidates,
                    [sourceStageId]: updatedSource,
                    [destinationStageId]: updatedDestination,
                },
            });
            setMessage('Candidate moved successfully!');
        } catch (error) {
            console.error('Error updating candidate stage on server:', error);
            setMessage('Error moving candidate.');
        }
    };

    if (!pipelineData.stages.length && Object.keys(pipelineData.candidates).length === 0) {
        return (
            <div>
                <h1>Pipeline</h1>
                <p>No stages or candidates available for this job.</p>
                <input
                    type="text"
                    value={newStageName}
                    onChange={(e) => setNewStageName(e.target.value)}
                    placeholder="New Stage Name"
                />
                <button onClick={handleAddStage}>Create First Stage</button>
            </div>
        );
    }

    return (
        <div>
            <h1>Pipeline</h1>
            {message && <p>{message}</p>}
            <input
                type="text"
                value={newStageName}
                onChange={(e) => setNewStageName(e.target.value)}
                placeholder="New Stage Name"
            />
            <button onClick={handleAddStage}>Add Stage</button>
            <DragDropContext onDragEnd={handleDragEnd}>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    {pipelineData.stages.map((stage) => (
                        <Stage
                            key={stage.id}
                            stage={stage}
                            candidates={pipelineData.candidates}
                            onDeleteStage={handleDeleteStage}
                            onDeleteCandidate={handleDeleteCandidate}
                        />
                    ))}
                </div>
            </DragDropContext>
            <div>
                <h2>Add Candidate</h2>
                <form onSubmit={handleAddCandidate}>
                    <input
                        type="text"
                        placeholder="Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <textarea
                        placeholder="Resume"
                        value={resume}
                        onChange={(e) => setResume(e.target.value)}
                    />
                    <button type="submit">Add Candidate</button>
                </form>
            </div>
        </div>
    );
}

export default Pipeline;
