import { useEffect, useReducer, useState } from "react";
import NavBar from "../../NavBar/NavBar";
import { useHttp } from "../../../hook/useHttp";
import { apiRequest } from "../../../services/api";
import { useAuth } from "../../../context/AuthContext";
import AlbumItem from "./AlbumItem";
const Albums = () => {
  // רדוסר מותאם לאלבומים
  const albumsReducer = (state, action) => {
    switch (action.type) {
      case "SET": return action.payload;
      case "ADD": return [...state, action.payload];
      default: return state;
    }
  };

  const { user } = useAuth();
  const { sendRequest, isLoading } = useHttp();
  const [albums, dispatch] = useReducer(albumsReducer, []);

  // States לחיפוש
  const [searchType, setSearchType] = useState("title");
  const [searchValue, setSearchValue] = useState("");

  const [isCreating, setIsCreating] = useState(false);
  const [newAlbumTitle, setNewAlbumTitle] = useState("");

  const saveNewAlbumHandler = async (e) => {
    e.preventDefault();
    if (!newAlbumTitle.trim()) return;

    try {
      const createdAlbum = await sendRequest(() =>
        apiRequest("/albums", {
          method: "POST",
          body: {
            title: newAlbumTitle,
            userId: user.id // שיוך למשתמש המחובר
          },
        })
      );

      // עדכון הרשימה דרך הדיספאץ' שכבר יש לך בקוד
      dispatch({ type: "ADD", payload: createdAlbum });

      // איפוס וסגירה
      setNewAlbumTitle("");
      setIsCreating(false);
    } catch (err) {
      console.error("Error creating new album", err);
    }
  };

  useEffect(() => {
    if (!user?.id) return;

    const fetchAlbums = async () => {
      // שליפת אלבומים של המשתמש הנוכחי בלבד
      const url = `/albums?userId=${user.id}`;
      const data = await sendRequest(() => apiRequest(url));
      dispatch({ type: "SET", payload: data });
    };

    fetchAlbums();
  }, [sendRequest, user?.id]);

  // לוגיקת סינון לפי דרישות (ID וכותרת)
  const displayedAlbums = albums.filter(album => {
    if (!searchValue) return true;

    const val = searchValue.toLowerCase();
    if (searchType === "id") {
      return album.id.toString().includes(val);
    }
    return album.title.toLowerCase().includes(val);
  });


  return (
    <section className="page-content">
      <NavBar />
      <h2>My Albums</h2>

      {/* כפתור לפתיחת הטופס */}
        <button onClick={() => setIsCreating(!isCreating)} className="add-btn">
            {isCreating ? "Cancel" : "➕ Create New Album"}
        </button>

        {/* הטופס עצמו */}
        {isCreating && (
            <form onSubmit={saveNewAlbumHandler} className="add-album-form" style={{ margin: '20px 0', padding: '15px', border: '1px dashed #007bff' }}>
                <input 
                    type="text" 
                    placeholder="Enter album title..." 
                    value={newAlbumTitle}
                    onChange={(e) => setNewAlbumTitle(e.target.value)}
                    required 
                    autoFocus
                />
                <button type="submit" disabled={isLoading}>
                    {isLoading ? "Saving..." : "Save Album"}
                </button>
            </form>
        )}

      {/* ממשק חיפוש בסיסי */}
      <div className="search-container">
        <select onChange={(e) => setSearchType(e.target.value)}>
          <option value="title">Title</option>
          <option value="id">ID</option>
        </select>
        <input
          type="text"
          placeholder="Search albums..."
          onChange={(e) => setSearchValue(e.target.value)}
        />
      </div>

      {isLoading && <p>Loading...</p>}

      <div className="albums-list">
        {displayedAlbums.map(album => (
          <AlbumItem key={album.id} album={album} />
        ))}
      </div>
    </section>
  );
};

export default Albums;








// import { useEffect, useReducer, useState } from "react";
// import NavBar from "../../NavBar/NavBar";
// import { useHttp } from "../../../hook/useHttp";
// import { apiRequest } from "../../../services/api";
// import { useAuth } from "../../../context/AuthContext";
// import AlbumItem from "./AlbumItem";
// const Albums = () => {
//   // רדוסר מותאם לאלבומים
//   const albumsReducer = (state, action) => {
//     switch (action.type) {
//       case "SET": return action.payload;
//       case "ADD": return [...state, action.payload];
//       default: return state;
//     }
//   };

//   const { user } = useAuth();
//   const { sendRequest, isLoading } = useHttp();
//   const [albums, dispatch] = useReducer(albumsReducer, []);

//   // States לחיפוש
//   const [searchType, setSearchType] = useState("title");
//   const [searchValue, setSearchValue] = useState("");

//   const [isCreating, setIsCreating] = useState(false);
//   const [newAlbumTitle, setNewAlbumTitle] = useState("");

//   const saveNewAlbumHandler = async (e) => {
//     e.preventDefault();
//     if (!newAlbumTitle.trim()) return;

//     try {
//       const createdAlbum = await sendRequest(() =>
//         apiRequest("/albums", {
//           method: "POST",
//           body: {
//             title: newAlbumTitle,
//             userId: user.id // שיוך למשתמש המחובר
//           },
//         })
//       );

//       // עדכון הרשימה דרך הדיספאץ' שכבר יש לך בקוד
//       dispatch({ type: "ADD", payload: createdAlbum });

//       // איפוס וסגירה
//       setNewAlbumTitle("");
//       setIsCreating(false);
//     } catch (err) {
//       console.error("Error creating new album", err);
//     }
//   };

//   useEffect(() => {
//     if (!user?.id) return;

//     const fetchAlbums = async () => {
//       // שליפת אלבומים של המשתמש הנוכחי בלבד
//       const url = `/albums?userId=${user.id}`;
//       const data = await sendRequest(() => apiRequest(url));
//       dispatch({ type: "SET", payload: data });
//     };

//     fetchAlbums();
//   }, [sendRequest, user?.id]);

//   // לוגיקת סינון לפי דרישות (ID וכותרת)
//   const displayedAlbums = albums.filter(album => {
//     if (!searchValue) return true;

//     const val = searchValue.toLowerCase();
//     if (searchType === "id") {
//       return album.id.toString().includes(val);
//     }
//     return album.title.toLowerCase().includes(val);
//   });


//   return (
//     <section className="page-content">
//       <NavBar />
//       <h2>My Albums</h2>

//       {/* כפתור לפתיחת הטופס */}
//         <button onClick={() => setIsCreating(!isCreating)} className="add-btn">
//             {isCreating ? "Cancel" : "➕ Create New Album"}
//         </button>

//         {/* הטופס עצמו */}
//         {isCreating && (
//             <form onSubmit={saveNewAlbumHandler} className="add-album-form" style={{ margin: '20px 0', padding: '15px', border: '1px dashed #007bff' }}>
//                 <input 
//                     type="text" 
//                     placeholder="Enter album title..." 
//                     value={newAlbumTitle}
//                     onChange={(e) => setNewAlbumTitle(e.target.value)}
//                     required 
//                     autoFocus
//                 />
//                 <button type="submit" disabled={isLoading}>
//                     {isLoading ? "Saving..." : "Save Album"}
//                 </button>
//             </form>
//         )}

//       {/* ממשק חיפוש בסיסי */}
//       <div className="search-container">
//         <select onChange={(e) => setSearchType(e.target.value)}>
//           <option value="title">Title</option>
//           <option value="id">ID</option>
//         </select>
//         <input
//           type="text"
//           placeholder="Search albums..."
//           onChange={(e) => setSearchValue(e.target.value)}
//         />
//       </div>

//       {isLoading && <p>Loading...</p>}

//       <div className="albums-list">
//         {displayedAlbums.map(album => (
//           <AlbumItem key={album.id} album={album} />
//         ))}
//       </div>
//     </section>
//   );
// };

// export default Albums;
