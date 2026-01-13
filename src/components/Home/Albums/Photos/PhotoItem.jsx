import { useState } from "react";
import { useHttp } from "../../../../hook/useHttp";
import { apiRequest } from "../../../../services/api";

const PhotoItem = ({ photo, onDataChange }) => {
    const { sendRequest, isLoading } = useHttp();
    const [isEditing, setIsEditing] = useState(false);
    const [editedTitle, setEditedTitle] = useState(photo.title);

    // לוגיקת עדכון עצמאית (כמו בטודוס)
    const updatePhotoHandler = async () => {
        try {
            const updated = await sendRequest(() =>
                apiRequest(`/photos/${photo.id}`, {
                    method: "PATCH",
                    body: { title: editedTitle },
                })
            );
            // מעדכנים את האבא רק שהנתונים השתנו (בשביל ה-UI הכללי)
            onDataChange({ type: "UPDATE", payload: updated });
            setIsEditing(false);
        } catch (err) {
            console.error("Error updating photo", err);
        }
    };

    // לוגיקת מחיקה עצמאית
    const deletePhotoHandler = async () => {
        if (!window.confirm("Delete this photo?")) return;
        try {
            await sendRequest(() => apiRequest(`/photos/${photo.id}`, { method: "DELETE" }));
            onDataChange({ type: "DELETE", payload: photo.id });
        } catch (err) {
            console.error("Error deleting photo", err);
        }
    };

    return (
        <div className="photo-card" style={{ border: '1px solid #ddd', padding: '10px', borderRadius: '8px' }}>
            <img src={photo.thumbnailUrl} alt={photo.title} style={{ width: '100%' }} />
            
            <div className="photo-info" style={{ margin: '10px 0' }}>
                {isEditing ? (
                    <>
                        <input 
                            type="text" 
                            value={editedTitle} 
                            onChange={(e) => setEditedTitle(e.target.value)}
                        />
                        <button onClick={updatePhotoHandler} disabled={isLoading}>💾</button>
                        <button onClick={() => setIsEditing(false)}>❌</button>
                    </>
                ) : (
                    <>
                        <p>{photo.title}</p>
                        <button onClick={() => setIsEditing(true)}>✎ Edit</button>
                    </>
                )}
            </div>

            <button onClick={deletePhotoHandler} disabled={isLoading} style={{ color: 'red' }}>
                {isLoading ? "Deleting..." : "Delete"}
            </button>
        </div>
    );
};

export default PhotoItem;