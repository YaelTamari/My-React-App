import NavBar from "../../NavBar/NavBar"
import { useEffect, useReducer, useState } from "react";
import { useHttp } from "../../../hook/useHttp";
import { apiRequest } from "../../../services/api";
import { useAuth } from "../../../context/AuthContext";
// import "../Posts/Posts.css";
import PostItem from "./PostItem";

const Posts = () => {

  const postsReducer = (state, action) => {
    switch (action.type) {
      case "SET": return action.payload;
      case "ADD": return [...state, action.payload];
      case "UPDATE": return state.map(p => p.id === action.payload.id ? action.payload : p);
      case "DELETE": return state.filter(p => p.id !== action.payload);
      default: return state;
    }
  };

  const { user } = useAuth();
  const { sendRequest, isLoading, error } = useHttp();
  const [creatingPost, setCreatingPost] = useState(false);
  const [newPostTitle, setNewPostTitle] = useState("");
  const [newPostBody, setNewPostBody] = useState("");
  const [selectedPost, setSelectedPost] = useState(null);
  const [posts, dispatch] = useReducer(postsReducer, []);
  const [searchType, setSearchType] = useState("title");
  const [searchValue, setSearchValue] = useState("");
  const [showAllPosts, setShowAllPosts] = useState(false);

  useEffect(() => {
    if (!user?.id) return;

    const fetchPosts = async () => {
      const url = showAllPosts ? "/posts" : `/posts?userId=${user.id}`;
      const data = await sendRequest(() => apiRequest(url));
      const filteredPosts = showAllPosts
        ? data
        : data.filter(p => String(p.userId) === String(user.id));
      dispatch({ type: "SET", payload: filteredPosts  });
    };

    fetchPosts();
  }, [sendRequest, user?.id, showAllPosts]);

  // useEffect(() => {
  //   if (!user?.id) return;

  //   const fetchPosts = async () => {
  //     const data = await sendRequest(() =>
  //       apiRequest(`/posts?userId=${user.id}`)
  //     );
  //     dispatch({ type: "SET", payload: data });
  //   };

  //   fetchPosts();
  // }, [sendRequest, user?.id]);

  const saveNewPostHandler = async () => {
    if (!newPostTitle.trim()) return;
    try {
      const created = await sendRequest(() =>
        apiRequest("/posts", {
          method: "POST",
          body: { title: newPostTitle, body: newPostBody, userId: String(user.id) },
        })
      );

      dispatch({ type: "ADD", payload: created });

      setNewPostTitle("");
      setNewPostBody("");
      setCreatingPost(false);
    } catch (err) {
      console.error("Error creating new post", err);
    }
  };

  const deletePostsHandler = async (id) => {
    try {
      await sendRequest(() => apiRequest(`/posts/${id}`, { method: "DELETE" }));
      dispatch({ type: "DELETE", payload: id });
    } catch (err) { }
  };

  const updatePost = async (id, field, value) => {
    try {
      const updated = await sendRequest(() =>
        apiRequest(`/posts/${id}`, {
          method: "PATCH",
          body: { [field]: value },
        })
      );
      dispatch({ type: "UPDATE", payload: updated });
      if (selectedPost?.id === id) setSelectedPost(updated);
    } catch (err) {
      console.error("Error updating post", err);
    }
  };

  const displayedPosts = posts
    .filter(posts => {
      if (!searchValue) return true; // אם התיבה ריקה, הצג הכל

      const val = searchValue.toLowerCase();

      // חיפוש לפי ID - עכשיו הוא בודק אם ה-ID *מכיל* את מה שכתבת
      if (searchType === "id") {
        return posts.id.toString().includes(val);
      }

      // ברירת מחדל: חיפוש לפי כותרת (סעיף 53)
      return posts.title.toLowerCase().includes(val);
    });

  return (

    <section className="posts-page page-content" >
       <NavBar />
      <h2>Posts של {user?.username}</h2>

      {isLoading && <p>טוען פוסטים...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      <div className="controls">
        <select
          value={searchType}
          onChange={e => setSearchType(e.target.value)}
        >
          <option value="title">חיפוש לפי כותרת</option>
          <option value="id">חיפוש לפי ID</option>
        </select>

        <input
          value={searchValue}
          onChange={e => setSearchValue(e.target.value)}
          placeholder="חיפוש..."
        />

        <button onClick={() => setShowAllPosts(prev => !prev)}>
          {showAllPosts ? "הצג רק את הפוסטים שלי" : "הצג את כל הפוסטים"}
        </button>
      </div>
      <div className="add-post">
        {!creatingPost ? (
          <button onClick={() => setCreatingPost(true)}>הוסף פוסט חדש</button>
        ) : (
          <div className="new-post-editor">
            <input
              type="text"
              value={newPostTitle}
              onChange={e => setNewPostTitle(e.target.value)}
              placeholder="כותרת לפוסט חדש"
            />
            <textarea
              value={newPostBody}
              onChange={e => setNewPostBody(e.target.value)}
              placeholder="תוכן הפוסט..."
              rows={5}
            />
            <button onClick={saveNewPostHandler}>שמור</button>
            <button onClick={() => {
              setCreatingPost(false);
              setNewPostTitle("");
              setNewPostBody("");
            }}>ביטול</button>
          </div>
        )}
      </div>


      <ul className="posts-list">
        {displayedPosts.map(post => (
          <PostItem
            key={post.id}
            post={post}
            selectedPost={selectedPost}
            onSelect={setSelectedPost}
            onDelete={deletePostsHandler}
            onSaveEdit={updatePost}

          />
        ))}
      </ul>
    </section>
  );
};

export default Posts;




// import NavBar from "../../NavBar/NavBar"
// import { useEffect, useReducer, useState } from "react";
// import { useHttp } from "../../../hook/useHttp";
// import { apiRequest } from "../../../services/api";
// import { useAuth } from "../../../context/AuthContext";
// // import "../Posts/Posts.css";
// import PostItem from "./PostItem";

// const Posts = () => {

//   const postsReducer = (state, action) => {
//     switch (action.type) {
//       case "SET": return action.payload;
//       case "ADD": return [...state, action.payload];
//       case "UPDATE": return state.map(p => p.id === action.payload.id ? action.payload : p);
//       case "DELETE": return state.filter(p => p.id !== action.payload);
//       default: return state;
//     }
//   };

//   const { user } = useAuth();
//   const { sendRequest, isLoading, error } = useHttp();
//   const [creatingPost, setCreatingPost] = useState(false);
//   const [newPostTitle, setNewPostTitle] = useState("");
//   const [newPostBody, setNewPostBody] = useState("");
//   const [selectedPost, setSelectedPost] = useState(null);
//   const [posts, dispatch] = useReducer(postsReducer, []);
//   const [searchType, setSearchType] = useState("title");
//   const [searchValue, setSearchValue] = useState("");
//   const [showAllPosts, setShowAllPosts] = useState(false);

//   useEffect(() => {
//     if (!user?.id) return;

//     const fetchPosts = async () => {
//       const url = showAllPosts ? "/posts" : `/posts?userId=${user.id}`;
//       const data = await sendRequest(() => apiRequest(url));
//       const filteredPosts = showAllPosts
//         ? data
//         : data.filter(p => String(p.userId) === String(user.id));
//       dispatch({ type: "SET", payload: filteredPosts  });
//     };

//     fetchPosts();
//   }, [sendRequest, user?.id, showAllPosts]);

//   // useEffect(() => {
//   //   if (!user?.id) return;

//   //   const fetchPosts = async () => {
//   //     const data = await sendRequest(() =>
//   //       apiRequest(`/posts?userId=${user.id}`)
//   //     );
//   //     dispatch({ type: "SET", payload: data });
//   //   };

//   //   fetchPosts();
//   // }, [sendRequest, user?.id]);

//   const saveNewPostHandler = async () => {
//     if (!newPostTitle.trim()) return;
//     try {
//       const created = await sendRequest(() =>
//         apiRequest("/posts", {
//           method: "POST",
//           body: { title: newPostTitle, body: newPostBody, userId: String(user.id) },
//         })
//       );

//       dispatch({ type: "ADD", payload: created });

//       setNewPostTitle("");
//       setNewPostBody("");
//       setCreatingPost(false);
//     } catch (err) {
//       console.error("Error creating new post", err);
//     }
//   };

//   const deletePostsHandler = async (id) => {
//     try {
//       await sendRequest(() => apiRequest(`/posts/${id}`, { method: "DELETE" }));
//       dispatch({ type: "DELETE", payload: id });
//     } catch (err) { }
//   };

//   const updatePost = async (id, field, value) => {
//     try {
//       const updated = await sendRequest(() =>
//         apiRequest(`/posts/${id}`, {
//           method: "PATCH",
//           body: { [field]: value },
//         })
//       );
//       dispatch({ type: "UPDATE", payload: updated });
//       if (selectedPost?.id === id) setSelectedPost(updated);
//     } catch (err) {
//       console.error("Error updating post", err);
//     }
//   };

//   const displayedPosts = posts
//     .filter(posts => {
//       if (!searchValue) return true; // אם התיבה ריקה, הצג הכל

//       const val = searchValue.toLowerCase();

//       // חיפוש לפי ID - עכשיו הוא בודק אם ה-ID *מכיל* את מה שכתבת
//       if (searchType === "id") {
//         return posts.id.toString().includes(val);
//       }

//       // ברירת מחדל: חיפוש לפי כותרת (סעיף 53)
//       return posts.title.toLowerCase().includes(val);
//     });

//   return (

//     <section className="posts-page">
//        <NavBar />
//       <h2>Posts של {user?.username}</h2>

//       {isLoading && <p>טוען פוסטים...</p>}
//       {error && <p style={{ color: "red" }}>{error}</p>}

//       <div className="controls">
//         <select
//           value={searchType}
//           onChange={e => setSearchType(e.target.value)}
//         >
//           <option value="title">חיפוש לפי כותרת</option>
//           <option value="id">חיפוש לפי ID</option>
//         </select>

//         <input
//           value={searchValue}
//           onChange={e => setSearchValue(e.target.value)}
//           placeholder="חיפוש..."
//         />

//         <button onClick={() => setShowAllPosts(prev => !prev)}>
//           {showAllPosts ? "הצג רק את הפוסטים שלי" : "הצג את כל הפוסטים"}
//         </button>
//       </div>
//       <div className="add-post">
//         {!creatingPost ? (
//           <button onClick={() => setCreatingPost(true)}>הוסף פוסט חדש</button>
//         ) : (
//           <div className="new-post-editor">
//             <input
//               type="text"
//               value={newPostTitle}
//               onChange={e => setNewPostTitle(e.target.value)}
//               placeholder="כותרת לפוסט חדש"
//             />
//             <textarea
//               value={newPostBody}
//               onChange={e => setNewPostBody(e.target.value)}
//               placeholder="תוכן הפוסט..."
//               rows={5}
//             />
//             <button onClick={saveNewPostHandler}>שמור</button>
//             <button onClick={() => {
//               setCreatingPost(false);
//               setNewPostTitle("");
//               setNewPostBody("");
//             }}>ביטול</button>
//           </div>
//         )}
//       </div>


//       <ul className="posts-list">
//         {displayedPosts.map(post => (
//           <PostItem
//             key={post.id}
//             post={post}
//             selectedPost={selectedPost}
//             onSelect={setSelectedPost}
//             onDelete={deletePostsHandler}
//             onSaveEdit={updatePost}

//           />
//         ))}
//       </ul>
//     </section>
//   );
// };

// export default Posts;

// {/* <ul className="posts-list">
//         {displayedPosts.map(post => (
//           <li key={post.id} className={`post-item ${selectedPost?.id === post.id ? "selected" : ""}`}>
//             <span><strong>{post.id}</strong></span>

//             {editingPost?.id === post.id ? (
//               editingField === "title" ? (
//                 <input
//                   value={draftValue}
//                   onChange={e => setDraftValue(e.target.value)}
//                 />
//               ) : (
//                 <textarea
//                   value={draftValue ?? ""}
//                   onChange={e => setDraftValue(e.target.value)}
//                   rows={5}
//                 />
//               )
//             ) : (
//               <>
//                 <span>{post.title}</span>
//               </>
//             )}

//             <button onClick={() => setSelectedPost(post)}>הצג</button>
//             <button onClick={() => {
//               setEditingPost(post);
//               setEditingField("title");
//               setDraftValue(post.title);
//             }}>ערוך כותרת</button>

//             <button onClick={() => {
//               setEditingPost(post);
//               setEditingField("body");
//               setDraftValue(post.body);
//             }}>ערוך תוכן</button>

//             <button onClick={() => deletePostsHandler(post.id)}>מחק</button>

//             {editingPost?.id === post.id && editingField && (
//               <>
//                 <button onClick={saveEditHandler}>שמור</button>
//                 <button onClick={() => { setEditingPost(null); setEditingField(null); setDraftValue(""); }}>ביטול</button>
//               </>
//             )}
//           </li>
//         ))}
//       </ul> */}

// {/* {selectedPost && (
//         <div className="post-details">
//           <hr />
//           <h3>{selectedPost.title}</h3>
//           <p>{selectedPost.body}</p>

//           <button onClick={() => setSelectedPost(null)}>
//             חזרה לרשימה
//           </button>
//         </div>
//       )} */}