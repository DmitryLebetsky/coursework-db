import React, { useState } from 'react';
import Comments from './Comments';

const Candidate = ({ candidate, stageId, onDeleteCandidate }) => {
    const [showComments, setShowComments] = useState(false);

    return (
        <div
            style={{
                padding: '1rem',
                marginBottom: '1rem',
                background: '#f9f9f9',
                border: '1px solid #ddd',
                borderRadius: '4px',
            }}
        >
            <p>{candidate.name}</p>
            <p>{candidate.email}</p>
            <button onClick={() => setShowComments((prev) => !prev)}>
                {showComments ? 'Hide Comments' : 'Show Comments'}
            </button>
            <button onClick={() => onDeleteCandidate(candidate.candidate_id, stageId)}>
                Delete
            </button>
            {showComments && <Comments candidateId={candidate.candidate_id} />}
        </div>
    );
}

export default Candidate;
