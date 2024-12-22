import React, { useState, useEffect } from 'react';
import { fetchCommentsByCandidate, addComment } from '../api/candidateCommentApi';

const Comments = ({ candidateId }) => {
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [message, setMessage] = useState('');

    useEffect(() => {
        const loadComments = async () => {
            try {
                const data = await fetchCommentsByCandidate(candidateId);
                setComments(data);
            } catch (error) {
                console.error('Error fetching comments:', error);
            }
        };

        loadComments();
    }, [candidateId]);

    const handleAddComment = async (e) => {
        e.preventDefault();
        try {
            const comment = await addComment(candidateId, newComment);
            setComments((prev) => [comment, ...prev]);
            setNewComment('');
            setMessage('Comment added successfully!');
        } catch (error) {
            console.error('Error adding comment:', error);
            setMessage('Error adding comment.');
        }
    };

    return (
        <div>
            <h3>Comments</h3>
            {message && <p>{message}</p>}
            <ul>
                {comments.map((comment) => (
                    <li key={comment.id}>
                        <p>
                            <strong>{comment.recruiter_name}</strong>: {comment.comment}
                        </p>
                        <p>{new Date(comment.created_at).toLocaleString()}</p>
                    </li>
                ))}
            </ul>
            <form onSubmit={handleAddComment}>
                <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Add your comment"
                />
                <button type="submit">Add Comment</button>
            </form>
        </div>
    );
}

export default Comments;
