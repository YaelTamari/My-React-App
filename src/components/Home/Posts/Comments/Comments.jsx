import { useState, useEffect } from "react";
import { apiRequest } from "../../../../services/api";
import { useHttp } from "../../../../hook/useHttp";
import { useAuth } from "../../../../context/AuthContext"

const Comments = ({ postId }) => {
    const { user: currentUser } = useAuth();
    const { sendRequest } = useHttp();
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState("");
    const [isAdding, setIsAdding] = useState(false);
    const [editingCommentId, setEditingCommentId] = useState(null);
    const [editValue, setEditValue] = useState("");

    useEffect(() => {
        if (comments.length > 0) return;
        const fetchComments = async () => {
            const data = await sendRequest(() => apiRequest(`/comments?postId=${postId}`));
            setComments(data);
        };
        fetchComments();
    }, [postId, sendRequest]);

    const addComment = async () => {
        if (!newComment.trim()) return;
        const created = await sendRequest(() =>
            apiRequest("/comments", {
                method: "POST", body: {
                    postId,
                    body: newComment,
                    name: currentUser.username,
                    email: currentUser.email
                }
            })
        );
        setComments(prev => [...prev, created]);
        setNewComment("");
        setIsAdding(false);
    };

    const deleteComment = async (id) => {
        await sendRequest(() => apiRequest(`/comments/${id}`, { method: "DELETE" }));
        setComments(prev => prev.filter(c => c.id !== id));
    };

    const startEdit = (comment) => {
        setEditingCommentId(comment.id);
        setEditValue(comment.body);
    };

    const cancelEdit = () => {
        setEditingCommentId(null);
        setEditValue("");
    };

    const saveEdit = async (id) => {
        if (!editValue.trim()) return;
        const updated = await sendRequest(() =>
            apiRequest(`/comments/${id}`, {
                method: "PATCH",
                body: { body: editValue }
            })
        );
        setComments(prev =>
            prev.map(c => c.id === id ? updated : c)
        );
        cancelEdit();
    };
    return (
        <div className="comments-section">
            <h4>Comments</h4>
            <ul>
                {comments.map(c => (
                    <li key={c.id}>
                        <strong>
                            {c.email === currentUser.email
                                ? "אני"
                                : `${c.name} (${c.email})`}
                        </strong>
                        {editingCommentId === c.id ? (
                            <>
                                <textarea
                                    value={editValue}
                                    onChange={e => setEditValue(e.target.value)}
                                    rows={3}
                                />
                                <button onClick={() => saveEdit(c.id)}>שמור</button>
                                <button onClick={cancelEdit}>ביטול</button>
                            </>
                        ) : (
                            <span> {c.body}</span>
                        )}
                        {c.email === currentUser.email && editingCommentId !== c.id && (
                            <>
                                <button onClick={() => startEdit(c)}>ערוך</button>
                                <button onClick={() => deleteComment(c.id)}>מחק</button>
                            </>
                        )}
                    </li>
                ))}
            </ul>

            {!isAdding && (
                <button onClick={() => setIsAdding(true)}>
                    הוסף תגובה
                </button>
            )}

            {isAdding && (
                <>
                    <textarea
                        value={newComment}
                        onChange={e => setNewComment(e.target.value)}
                        rows={3}
                    />
                    <button onClick={addComment}>שמור</button>
                    <button onClick={() => {
                        setIsAdding(false);
                        setNewComment("");
                    }}>
                        ביטול
                    </button>
                </>
            )}
        </div>
    );
};

export default Comments;