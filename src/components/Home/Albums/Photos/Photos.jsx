import { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import { useHttp } from "../../../../hook/useHttp";
import { apiRequest } from "../../../../services/api";
import PhotoItem from "./PhotoItem"

const Photos = () => {
    const { albumId } = useParams();
    const { sendRequest, isLoading } = useHttp();

    const [photos, setPhotos] = useState([]); // כאן נשמור את כל התמונות שנצברו
    const [hasMore, setHasMore] = useState(true); // האם יש עוד תמונות בשרת?

    const LIMIT = 4; // נביא 10 תמונות בכל פעם

    const [isAdding, setIsAdding] = useState(false);
    const [newPhoto, setNewPhoto] = useState({ title: "", url: "" });


    const fetchPhotos = useCallback(async (start) => {
        const url = `/photos?albumId=${albumId}&_start=${start}&_limit=${LIMIT}`;
        try {
            const data = await sendRequest(() => apiRequest(url));
            if (!data || data.length === 0) {
                setHasMore(false);
                return;
            }

            setPhotos(prev => {
                // הגנה נוספת מפני כפילויות
                const unique = data.filter(newItem => !prev.some(oldItem => oldItem.id === newItem.id));
                return [...prev, ...unique];
            });

            if (data.length < LIMIT) setHasMore(false);
        } catch (err) {
            console.error(err);
        }
    }, [albumId, sendRequest]); // בלי photos.length כאן!

    // 2. ה-useEffect לטעינה ראשונית - חייב להיות נקי
    useEffect(() => {
        setPhotos([]); // איפוס
        setHasMore(true);

        // קריאה ראשונה תמיד מאינדקס 0
        fetchPhotos(0);

    }, [albumId, fetchPhotos]); // רק אלו! // כאן photos.length הוא המפתח

    const loadMoreHandler = () => {
        fetchPhotos(photos.length); // פשוט מפעילים את הפונקציה שוב
    };

    const addPhotoHandler = async (e) => {
    e.preventDefault();
    
    // בדיקה חשובה: ודאי ש-albumId קיים לפני השליחה
    if (!albumId) {
        console.error("No album ID found in URL");
        return;
    }

    try {
        const createdPhoto = await sendRequest(() =>
            apiRequest("/photos", {
                method: "POST",
                body: {
                    // כאן התיקון: ודאי שהשם תואם בדיוק למה שהשרת מצפה
                    albumId: albumId, 
                    title: newPhoto.title,
                    url: newPhoto.url,
                    thumbnailUrl: newPhoto.url 
                }
            })
        );

        // הוספה למסך עם ה-ID שחזר מהשרת
        setPhotos(prev => [createdPhoto, ...prev]);
        
        // איפוס הטופס
        setIsAdding(false);
        setNewPhoto({ title: "", url: "" });
        
    } catch (err) {
        console.error("Failed to add photo", err);
    }
};

 

    const handleDataChange = (action) => {
        if (action.type === "DELETE") {
            setPhotos(prev => prev.filter(p => p.id !== action.payload));
        } else if (action.type === "UPDATE") {
            setPhotos(prev => prev.map(p => p.id === action.payload.id ? action.payload : p));
        }
    };

    return (
        <section className="photos-page">
            <h2>Photos for Album {albumId}</h2>

            {/* טופס הוספה */}
            <button onClick={() => setIsAdding(!isAdding)}>
                {isAdding ? "Cancel" : "Add New Photo"}
            </button>

            {isAdding && (
                <form onSubmit={addPhotoHandler} style={{ margin: '20px 0', border: '1px solid #ddd', padding: '15px' }}>
                    <input
                        type="text"
                        placeholder="Photo Title"
                        value={newPhoto.title}
                        onChange={(e) => setNewPhoto({ ...newPhoto, title: e.target.value })}
                        required
                    />
                    <input
                        type="text"
                        placeholder="Image URL"
                        value={newPhoto.url}
                        onChange={(e) => setNewPhoto({ ...newPhoto, url: e.target.value })}
                        required
                    />
                    <button type="submit">Save Photo</button>
                </form>
            )}


            {/* רשימת התמונות */}
            <div className="photos-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '20px' }}>
                {photos.map(photo => (
                    <PhotoItem
                        key={photo.id}
                        photo={photo}
                        onDataChange={handleDataChange}
                    />
                ))}
            </div>

            {/* בדיקה: האם יש עוד תמונות והאם אנחנו לא באמצע טעינה */}
            {hasMore ? (
                <div style={{ textAlign: 'center', margin: '30px 0' }}>
                    <button
                        onClick={loadMoreHandler}
                        disabled={isLoading}

                    >
                        {isLoading ? "טוען..." : "טען עוד תמונות"}
                    </button>
                </div>
            ) : (
                <p style={{ textAlign: 'center', color: '#666', margin: '20px 0' }}>
                    ✨ הגעת לסוף האלבום - אין תמונות נוספות ✨
                </p>
            )}
        </section>
    );
};

export default Photos;




// import { useEffect, useState, useCallback } from "react";
// import { useParams } from "react-router-dom";
// import { useHttp } from "../../../../hook/useHttp";
// import { apiRequest } from "../../../../services/api";
// import PhotoItem from "./PhotoItem";

// const Photos = () => {
//     const { albumId } = useParams();
//     const { sendRequest, isLoading } = useHttp();

//     const [photos, setPhotos] = useState([]); // כאן נשמור את כל התמונות שנצברו
//     const [hasMore, setHasMore] = useState(true); // האם יש עוד תמונות בשרת?

//     const LIMIT = 6; // נביא 10 תמונות בכל פעם

//     const [isAdding, setIsAdding] = useState(false);
//     const [newPhoto, setNewPhoto] = useState({ title: "", url: "" });


//     const fetchPhotos = useCallback(async (start) => {
//         const url = `/photos?albumId=${albumId}&_start=${start}&_limit=${LIMIT}`;
//         try {
//             const data = await sendRequest(() => apiRequest(url));
//             if (!data || data.length === 0) {
//                 setHasMore(false);
//                 return;
//             }

//             setPhotos(prev => {
//                 // הגנה נוספת מפני כפילויות
//                 const unique = data.filter(newItem => !prev.some(oldItem => oldItem.id === newItem.id));
//                 return [...prev, ...unique];
//             });

//             if (data.length < LIMIT) setHasMore(false);
//         } catch (err) {
//             console.error(err);
//         }
//     }, [albumId, sendRequest]); // בלי photos.length כאן!

//     // 2. ה-useEffect לטעינה ראשונית - חייב להיות נקי
//     useEffect(() => {
//         setPhotos([]); // איפוס
//         setHasMore(true);

//         // קריאה ראשונה תמיד מאינדקס 0
//         fetchPhotos(0);

//     }, [albumId, fetchPhotos]); // רק אלו! // כאן photos.length הוא המפתח

//     const loadMoreHandler = () => {
//         fetchPhotos(photos.length); // פשוט מפעילים את הפונקציה שוב
//     };

//     const addPhotoHandler = async (e) => {
//         e.preventDefault();

//         // בדיקה חשובה: ודאי ש-albumId קיים לפני השליחה
//         if (!albumId) {
//             console.error("No album ID found in URL");
//             return;
//         }

//         try {
//             const createdPhoto = await sendRequest(() =>
//                 apiRequest("/photos", {
//                     method: "POST",
//                     body: {
//                         // כאן התיקון: ודאי שהשם תואם בדיוק למה שהשרת מצפה
//                         albumId: albumId,
//                         title: newPhoto.title,
//                         url: newPhoto.url,
//                         thumbnailUrl: newPhoto.url
//                     }
//                 })
//             );

//             // הוספה למסך עם ה-ID שחזר מהשרת
//             setPhotos(prev => [createdPhoto, ...prev]);

//             // איפוס הטופס
//             setIsAdding(false);
//             setNewPhoto({ title: "", url: "" });

//         } catch (err) {
//             console.error("Failed to add photo", err);
//         }
//     };



//     const handleDataChange = (action) => {
//         if (action.type === "DELETE") {
//             setPhotos(prev => prev.filter(p => p.id !== action.payload));
//         } else if (action.type === "UPDATE") {
//             setPhotos(prev => prev.map(p => p.id === action.payload.id ? action.payload : p));
//         }
//     };

//     return (
//         <section className="photos-page">
//             <h2>Photos for Album {albumId}</h2>

//             {/* טופס הוספה */}
//             <button onClick={() => setIsAdding(!isAdding)}>
//                 {isAdding ? "Cancel" : "Add New Photo"}
//             </button>

//             {isAdding && (
//                 <form onSubmit={addPhotoHandler} style={{ margin: '20px 0', border: '1px solid #ddd', padding: '15px' }}>
//                     <input
//                         type="text"
//                         placeholder="Photo Title"
//                         value={newPhoto.title}
//                         onChange={(e) => setNewPhoto({ ...newPhoto, title: e.target.value })}
//                         required
//                     />
//                     <input
//                         type="text"
//                         placeholder="Image URL"
//                         value={newPhoto.url}
//                         onChange={(e) => setNewPhoto({ ...newPhoto, url: e.target.value })}
//                         required
//                     />
//                     <button type="submit">Save Photo</button>
//                 </form>
//             )}


//             {/* רשימת התמונות */}
//             <div className="photos-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '20px' }}>
//                 {photos.map(photo => (
//                     <PhotoItem
//                         key={photo.id}
//                         photo={photo}
//                         onDataChange={handleDataChange}
//                     />
//                 ))}
//             </div>

//             {/* בדיקה: האם יש עוד תמונות והאם אנחנו לא באמצע טעינה */}
//             {hasMore ? (
//                 <div style={{ textAlign: 'center', margin: '30px 0' }}>
//                     <button
//                         onClick={loadMoreHandler}
//                         disabled={isLoading}

//                     >
//                         {isLoading ? "טוען..." : "טען עוד תמונות"}
//                     </button>
//                 </div>
//             ) : (
//                 <p style={{ textAlign: 'center', color: '#666', margin: '20px 0' }}>
//                     ✨ הגעת לסוף האלבום - אין תמונות נוספות ✨
//                 </p>
//             )}
//         </section>
//     );
// };

// export default Photos;
