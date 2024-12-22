import React from 'react';
import { Droppable, Draggable } from 'react-beautiful-dnd';
import Candidate from './Candidate';

function Stage({ stage, candidates, onDeleteStage, onDeleteCandidate }) {
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
                    <button onClick={() => onDeleteStage(stage.id)}>Delete Stage</button>
                    {(candidates[stage.id] || []).map((candidate, index) => (
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
                                >
                                    <Candidate
                                        candidate={candidate}
                                        stageId={stage.id}
                                        onDeleteCandidate={onDeleteCandidate}
                                    />
                                </div>
                            )}
                        </Draggable>
                    ))}
                    {provided.placeholder}
                </div>
            )}
        </Droppable>
    );
}

export default Stage;
