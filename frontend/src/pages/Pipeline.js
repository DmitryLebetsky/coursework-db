import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

function Pipeline({ jobId }) {
  const [stages, setStages] = useState([]);
  const [candidates, setCandidates] = useState({});
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchPipelineData = async () => {
      try {
        const token = localStorage.getItem('token');

        // Получение этапов
        const stagesResponse = await axios.get(`/api/stages/${jobId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        // Получение кандидатов
        const candidatesResponse = await axios.get(`/api/candidates/${jobId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setStages(stagesResponse.data);

        // Группируем кандидатов по этапам
        const groupedCandidates = {};
        stagesResponse.data.forEach((stage) => {
          groupedCandidates[stage.id] = candidatesResponse.data.filter(
            (candidate) => candidate.stage_id === stage.id
          );
        });

        setCandidates(groupedCandidates);
      } catch (error) {
        console.error('Error fetching pipeline data:', error);
      }
    };

    fetchPipelineData();
  }, [jobId]);

  const handleDragEnd = async (result) => {
    const { source, destination } = result;

    if (!destination) return; // Если кандидат не был перемещён

    const sourceStageId = source.droppableId;
    const destinationStageId = destination.droppableId;

    if (sourceStageId === destinationStageId) return; // Если кандидат остался в том же этапе

    const draggedCandidate = candidates[sourceStageId][source.index];

    // Обновляем кандидата на сервере
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        '/api/candidate-stage/update',
        {
          candidateId: draggedCandidate.id,
          stageId: destinationStageId,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Обновляем локальное состояние
      const updatedSource = Array.from(candidates[sourceStageId]);
      updatedSource.splice(source.index, 1);

      const updatedDestination = Array.from(candidates[destinationStageId] || []);
      updatedDestination.splice(destination.index, 0, draggedCandidate);

      setCandidates({
        ...candidates,
        [sourceStageId]: updatedSource,
        [destinationStageId]: updatedDestination,
      });

      setMessage('Candidate moved successfully!');
    } catch (error) {
      console.error('Error updating candidate stage:', error);
      setMessage('Error moving candidate.');
    }
  };

  return (
    <div>
      <h1>Pipeline</h1>
      {message && <p>{message}</p>}

      <DragDropContext onDragEnd={handleDragEnd}>
        <div style={{ display: 'flex', gap: '1rem' }}>
          {stages.map((stage) => (
            <Droppable key={stage.id} droppableId={stage.id.toString()}>
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
                  {candidates[stage.id]?.map((candidate, index) => (
                    <Draggable
                      key={candidate.id}
                      draggableId={candidate.id.toString()}
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
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          ))}
        </div>
      </DragDropContext>
    </div>
  );
}

export default Pipeline;
