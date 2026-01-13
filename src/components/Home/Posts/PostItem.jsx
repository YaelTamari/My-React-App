import React, { useState } from "react";
import Comments from "./Comments/Comments"
import { Link, useNavigate, useParams} from "react-router-dom";

const PostItem = ({
  post,
  selectedPost,
  onSelect,
  onDelete,
  onSaveEdit
}) => {
  const navigate = useNavigate();
  const [editingField, setEditingField] = useState(null); // "title" או "body"
  const [draftValue, setDraftValue] = useState("");
  const [showComments, setShowComments] = useState(false);
  const { userId } = useParams();

  const startEditing = (field) => {
    setEditingField(field);
    setDraftValue(post[field] ?? "");
  };

  const cancelEditing = () => {
    setEditingField(null);
    setDraftValue("");
  };

  const saveEditing = () => {
    if (!draftValue.trim()) return;
    onSaveEdit(post.id, editingField, draftValue);
    cancelEditing();
  };

  const isSelected = selectedPost?.id === post.id;

  
  return (
    <li className={`post-item ${isSelected ? "selected" : ""}`}>
      <span><strong>{post.id}</strong></span>

      {editingField ? (
        editingField === "title" ? (
          <input
            value={draftValue}
            onChange={e => setDraftValue(e.target.value)}
          />
        ) : (
          <textarea
            value={draftValue}
            onChange={e => setDraftValue(e.target.value)}
            rows={5}
          />
        )
      ) : (
        <span>{post.title}</span>
      )}
      {isSelected && (
        <div className="post-body">
          <p>{post.body}</p>
        </div>
      )}
      {isSelected && (
        <button onClick={() => navigate(`/users/${userId}/posts`)}>
          סגור פוסט
        </button>
      )}

      {!isSelected && (
        <Link to={`/users/${userId}/posts/${post.id}`}>
          <button>הצג</button>
        </Link>
      )}      {!editingField && <button onClick={() => startEditing("title")}>ערוך כותרת</button>}
      {!editingField && <button onClick={() => startEditing("body")}>ערוך תוכן</button>}
      <button onClick={() => onDelete(post.id)}>מחק</button>

      {editingField && (
        <>
          <button onClick={saveEditing}>שמור</button>
          <button onClick={cancelEditing}>ביטול</button>
        </>
      )}
      {isSelected && (
        <button onClick={() => setShowComments(prev => !prev)}>
          {showComments ? "הסתר תגובות" : "הצג תגובות"}
        </button>
      )}
      {isSelected && showComments && (
        <Comments postId={post.id} />
      )}

    </li>

  );
};

export default PostItem;






// import React, { useState } from "react";
// import Comments from "./Comments/Comments"
// import { useNavigate } from "react-router-dom";

// const PostItem = ({
//   post,
//   selectedPost,
//   onSelect,
//   onDelete,
//   onSaveEdit
// }) => {
//   const [editingField, setEditingField] = useState(null); // "title" או "body"
//   const [draftValue, setDraftValue] = useState("");
//   const [showComments, setShowComments] = useState(false);
//   const navigate = useNavigate();
//   const startEditing = (field) => {
//     setEditingField(field);
//     setDraftValue(post[field] ?? "");
//   };

//   const cancelEditing = () => {
//     setEditingField(null);
//     setDraftValue("");
//   };

//   const saveEditing = () => {
//     if (!draftValue.trim()) return;
//     onSaveEdit(post.id, editingField, draftValue);
//     cancelEditing();
//   };

//   const isSelected = selectedPost?.id === post.id;

//   return (
//     <li className={`post-item ${isSelected ? "selected" : ""}`}>
//       <span><strong>{post.id}</strong></span>

//       {editingField ? (
//         editingField === "title" ? (
//           <input
//             value={draftValue}
//             onChange={e => setDraftValue(e.target.value)}
//           />
//         ) : (
//           <textarea
//             value={draftValue}
//             onChange={e => setDraftValue(e.target.value)}
//             rows={5}
//           />
//         )
//       ) : (
//         <span>{post.title}</span>
//       )}
//       {isSelected && (
//         <div className="post-body">
//           <p>{post.body}</p>
//         </div>
//       )}
//       {isSelected && (
//         <button onClick={() => navigate(`/users/${userId}/posts`)}>
//           סגור פוסט
//         </button>
//       )}
//       {!isSelected && (
//         <Link to={`/users/${userId}/posts/${post.id}`}>
//           <button>הצג</button>
//         </Link>
//       )}




//       {/* <button onClick={() => {
//         onSelect(post);
//         navigate(`/users/${post.userId}/posts/${post.id}`);
//       }}>
//         הצג
//       </button> */}
//       {!editingField && <button onClick={() => startEditing("title")}>ערוך כותרת</button>}
//       {!editingField && <button onClick={() => startEditing("body")}>ערוך תוכן</button>}
//       <button onClick={() => onDelete(post.id)}>מחק</button>

//       {editingField && (
//         <>
//           <button onClick={saveEditing}>שמור</button>
//           <button onClick={cancelEditing}>ביטול</button>
//         </>
//       )}
//       {isSelected && (
//         <button onClick={() => setShowComments(prev => !prev)}>
//           {showComments ? "הסתר תגובות" : "הצג תגובות"}
//         </button>
//       )}
//       {isSelected && showComments && (
//         <Comments postId={post.id} />
//       )}

//     </li>

//   );
// };

// export default PostItem;