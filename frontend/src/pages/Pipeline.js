import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

function Pipeline() {
    const { jobId } = useParams(); // Получаем jobId из URL
    const [pipelineData, setPipelineData] = useState({ stages: [], candidates: {} });
    const [message, setMessage] = useState('');

    useEffect(() => {
        const fetchPipelineData = async () => {
            try {
                const token = localStorage.getItem('token');

                const response = await axios.get(`/api/stages/${jobId}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                console.log('Stages:', response.data);
                console.log('Candidates:', response.data.candidates);

                const groupedCandidates = {};
                response.data.stages.forEach((stage) => {
                    groupedCandidates[stage.id] = response.data.candidates.filter(
                        (candidate) => candidate.stage_id === stage.id
                    );
                });

                console.log('Grouped candidates:', groupedCandidates);

                setPipelineData({
                    stages: response.data.stages,
                    candidates: groupedCandidates,
                });
            } catch (error) {
                console.error('Error fetching pipeline data:', error);
            }
        };

        fetchPipelineData();
    }, [jobId]);



    const handleDragEnd = async (result) => {
        const { source, destination } = result;
    
        if (!destination) return; // Если кандидат не был перемещён
    
        const sourceStageId = String(source.droppableId);
        const destinationStageId = String(destination.droppableId);
    
        if (sourceStageId === destinationStageId) return; // Если кандидат остался в том же этапе
    
        const draggedCandidate = pipelineData.candidates[sourceStageId][source.index];
    
        // Обновление данных на сервере
        try {
            const token = localStorage.getItem('token');
            console.log('Sending data to server:', {
                candidateId: draggedCandidate.candidate_id,
                stageId: destinationStageId,
            });
            await axios.post(
                '/api/candidate-stage/update',
                {
                    candidateId: draggedCandidate.candidate_id,
                    stageId: destinationStageId,
                },
                { headers: { Authorization: `Bearer ${token}` } }
            );
    
            // Локальное обновление состояния
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


    if (!pipelineData.stages.length || Object.keys(pipelineData.candidates).length === 0) {
        console.log('Pipeline data is not ready yet');
        return <p>Loading pipeline data...</p>;
    }

    console.log('Rendering Pipeline');

    return (
        <div>
            <h1>Pipeline</h1>
            {message && <p>{message}</p>}

            <DragDropContext onDragEnd={handleDragEnd}>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    {pipelineData.stages.map((stage) => {
                        console.log(`Droppable ID for stage: ${stage.id}`);
                        return (
                            <Droppable
                                key={stage.id}
                                droppableId={String(stage.id)}
                                isDropDisabled={false}
                                isCombineEnabled={false}
                                ignoreContainerClipping={false}
                            >
                                {(provided) => (
                                    <div
                                        ref={provided.innerRef}
                                        {...provided.droppableProps}
                                        style={{
                                            padding: '1rem',
                                            border: '1px solid #ccc',
                                            borderRadius: '8px',
                                            minWidth: '200px',
                                        }}
                                    >
                                        <h2>{stage.name}</h2>
                                        {(pipelineData.candidates[stage.id] || []).map((candidate, index) => {
                                            console.log(`Draggable ID for candidate: ${candidate.candidate_stage_id}`);
                                            console.log(`Index for candidate ${candidate.candidate_stage_id}: ${index}`);
                                            return (
                                                <Draggable
                                                    key={candidate.candidate_stage_id}
                                                    draggableId={String(candidate.candidate_stage_id)}
                                                    index={index}
                                                >
                                                    {(provided) => (
                                                        <div
                                                            ref={provided.innerRef}
                                                            {...provided.draggableProps}
                                                            {...provided.dragHandleProps}
                                                            style={{
                                                                padding: '1rem',
                                                                marginBottom: '1rem',
                                                                background: '#f9f9f9',
                                                                border: '1px solid #ddd',
                                                                borderRadius: '4px',
                                                                ...provided.draggableProps.style,
                                                            }}
                                                        >
                                                            <p>{candidate.name}</p>
                                                            <p>{candidate.email}</p>
                                                        </div>
                                                    )}
                                                </Draggable>
                                            )
                                        })}
                                        {provided.placeholder}
                                    </div>
                                )}
                            </Droppable>
                        )
                    })}
                </div>
            </DragDropContext>
        </div>
    );
}

export default Pipeline;
