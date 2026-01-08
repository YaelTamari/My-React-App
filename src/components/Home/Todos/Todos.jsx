import NavBar from "../../NavBar/NavBar"
import { useEffect, useReducer, useState } from "react";
import { useHttp } from "../../../hook/useHttp";
import { apiRequest } from "../../../services/api";
import { useAuth } from "../../../context/AuthContext";
// import "../Todos/TodoItem"
import "../Todos/Todos.css";

// 1. Reducer לניהול הנתונים (דרישת פרק ו')
const todosReducer = (state, action) => {
  switch (action.type) {
    case "SET": return action.payload;
    case "ADD": return [...state, action.payload];
    case "DELETE": return state.filter(t => t.id !== action.payload);
    case "UPDATE": return state.map(t => t.id === action.payload.id ? action.payload : t);
    default: return state;
  }
};

export default function Todos() {
  const { user } = useAuth();
  const [todos, dispatch] = useReducer(todosReducer, []);

  // States לניהול הממשק
  const [newTodoTitle, setNewTodoTitle] = useState("");
  const [sortBy, setSortBy] = useState("id");
  const [searchType, setSearchType] = useState("title");
  const [searchValue, setSearchValue] = useState("");

  const { sendRequest, isLoading, error, clearError } = useHttp();

  // 2. טעינת המידע של המשתמש הפעיל בלבד (סעיף 50)
  useEffect(() => {
    if (!user?.id) return;
    const fetchTodos = async () => {
      try {
        const data = await sendRequest(() => apiRequest(`/todos?userId=${user.id}`));
        dispatch({ type: "SET", payload: data });
      } catch (err) { }
    };
    fetchTodos();
  }, [sendRequest, user?.id]);

  // 3. פעולות CRUD (סעיף 54)
  const addTodoHandler = async () => {
    if (!newTodoTitle.trim()) return;
    try {
      const created = await sendRequest(() =>
        apiRequest("/todos", {
          method: "POST",
          body: { title: newTodoTitle, completed: false, userId: user.id },
        })
      );
      dispatch({ type: "ADD", payload: created });
      setNewTodoTitle("");
    } catch (err) { }
  };

  const deleteTodoHandler = async (id) => {
    try {
      await sendRequest(() => apiRequest(`/todos/${id}`, { method: "DELETE" }));
      dispatch({ type: "DELETE", payload: id });
    } catch (err) { }
  };

  const toggleTodoHandler = async (todo) => {
    try {
      const updated = await sendRequest(() =>
        apiRequest(`/todos/${todo.id}`, {
          method: "PATCH", // עדכון מצב ביצוע בלבד
          body: { completed: !todo.completed },
        })
      );
      dispatch({ type: "UPDATE", payload: updated });
    } catch (err) { }
  };

  const updateTitleHandler = async (todo) => {
    const newTitle = prompt("עריכת כותרת:", todo.title);
    if (!newTitle || newTitle === todo.title) return;
    try {
      const updated = await sendRequest(() =>
        apiRequest(`/todos/${todo.id}`, {
          method: "PATCH", // עדכון תוכן בלבד (סעיף 54)
          body: { title: newTitle },
        })
      );
      dispatch({ type: "UPDATE", payload: updated });
    } catch (err) { }
  };

  // 4. לוגיקת סינון ומיון (סעיפים 52, 53)
  // לוגיקת סינון משופרת
  const displayedTodos = todos
    .filter(todo => {
      if (!searchValue) return true; // אם התיבה ריקה, הצג הכל

      const val = searchValue.toLowerCase();

      // חיפוש לפי ID - עכשיו הוא בודק אם ה-ID *מכיל* את מה שכתבת
      if (searchType === "id") {
        return todo.id.toString().includes(val);
      }

      // חיפוש לפי מצב (בוצע/לא בוצע)
      if (searchType === "completed") {
        const status = todo.completed ? "done" : "pending";
        return status.includes(val);
      }

      // ברירת מחדל: חיפוש לפי כותרת (סעיף 53)
      return todo.title.toLowerCase().includes(val);
    })
    .sort((a, b) => {
      if (sortBy === "title") return a.title.localeCompare(b.title);
      if (sortBy === "completed") return a.completed - b.completed;
      return a.id - b.id;
    });

  return (
    <section className="todos-container page-content">
       <NavBar />
      <h2>מטלות החורף של {user?.username}</h2>

      {/* הוספה */}
      <div className="input-group">
        <input
          value={newTodoTitle}
          onChange={e => setNewTodoTitle(e.target.value)}
          placeholder="משימה חדשה..."
        />
        <button onClick={addTodoHandler} disabled={isLoading}>הוסף</button>
      </div>

      {/* חיפוש ומיון (סעיפים 52, 53) */}
      <div className="controls">
        <select value={sortBy} onChange={e => setSortBy(e.target.value)}>
          <option value="id">מיין לפי ID</option>
          <option value="title">מיין לפי א-ב</option>
          <option value="completed">מיין לפי ביצוע</option>
        </select>

        <select value={searchType} onChange={e => setSearchType(e.target.value)}>
          <option value="title">חפש בכותרת</option>
          <option value="id">חפש לפי ID</option>
          <option value="completed">חפש לפי מצב</option>
        </select>

        <input
          value={searchValue}
          onChange={e => setSearchValue(e.target.value)}
          placeholder="חפש פריטים..."
        />
      </div>

      {isLoading && <p>טוען...</p>}
      {error && <p style={{ color: "red" }} onClick={clearError}>{error} [סגור]</p>}

      {/* <ul className="todo-grid">
        {displayedTodos.map(todo => (
          <TodoItem
            key={todo.id}
            todo={todo}
            onToggle={toggleTodoHandler}
            onDelete={deleteTodoHandler}
            onUpdate={updateTitleHandler}
          />
        ))}
      </ul> */}
      <ul className="todo-list">

        {displayedTodos.map(todo => (

          // <li key={todo.id} className="todo-item">
          <li key={todo.id} className={`todo-item ${todo.completed ? "completed" : ""}`}>
            {/* הצגת מזהה, כותרת ו-checkbox (סעיף 51) */}

            <span>{todo.id}</span>

            <input

              type="checkbox"

              checked={todo.completed}

              onChange={() => toggleTodoHandler(todo)}

            />

            <span style={{ textDecoration: todo.completed ? "line-through" : "none" }}>

              {todo.title}

            </span>



            <div className="actions">

              <button onClick={() => updateTitleHandler(todo)}>📝</button>

              <button onClick={() => deleteTodoHandler(todo.id)}>🗑️</button>

            </div>

          </li>

        ))}

      </ul>
    </section>
  );
}












// import { useEffect, useState, useContext } from "react";
// import { apiRequest } from "../../../services/api";
// import { useAuth } from "../../../context/AuthContext";

// const Todos = () => {
//   const { user } = useAuth();;
//   const [todos, setTodos] = useState([]);
//   const [newTodo, setNewTodo] = useState("");
//   const [error, setError] = useState(null);

//   // ---------- GET TODOS ----------
//   useEffect(() => {
//     if (!user) return;

//     apiRequest(`/todos?userId=${user.id}`)
//       .then(setTodos)
//       .catch(err => setError(err.message));
//   }, [user]);

//   // ---------- POST TODO ----------
//   const addTodo = async () => {
//     if (!newTodo.trim()) return;

//     try {
//       const createdTodo = await apiRequest("/todos", {
//         method: "POST",
//         body: {
//           title: newTodo,
//           completed: false,
//           userId: user.id,
//         },
//       });

//       setTodos(prev => [...prev, createdTodo]);
//       setNewTodo("");
//     } catch (err) {
//       setError(err.message);
//     }
//   };

//   // ---------- DELETE TODO ----------
//   const deleteTodo = async (id) => {
//     try {
//       await apiRequest(`/todos/${id}`, { method: "DELETE" });
//       setTodos(prev => prev.filter(todo => todo.id !== id));
//     } catch (err) {
//       setError(err.message);
//     }
//   };

//   const completed = async (id) => {
//     const todoToUpdate = todos.find(t => t.id === id);
//     if (!todoToUpdate) return;

//     try {
//       const updated = await apiRequest(`/todos/${id}`, {
//         method: "PUT",
//         body: { ...todoToUpdate, completed: !todoToUpdate.completed }
//       });
//       setTodos(prev => prev.map(t => t.id === id ? updated : t));
//     } catch (err) {
//       setError(err.message);
//     }
//   };




//   return (
//     <div>
//       <h2>Todos</h2>

//       {error && <p style={{ color: "red" }}>{error}</p>}

//       <input
//         value={newTodo}
//         onChange={e => setNewTodo(e.target.value)}
//         placeholder="New todo"
//       />
//       <button onClick={addTodo}>Add</button>

//       <ul>
//         {todos.map(todo => (
//           <li key={todo.id}>
//             {todo.title}
//             <button onClick={() => deleteTodo(todo.id)}>❌</button>
//             <input
//               type="checkbox"
//               checked={todo.completed}
//               onChange={() => completed(todo.id)}
//             />
//           </li>
//         ))}
//       </ul>

//     </div>
//   );
// };

// export default Todos;







// // import { useEffect, useState } from "react";
// // import { apiRequest } from "../../../services/api";
// // import { useAuth } from "../../../context/AuthContext";

// // const Todos = () => {
// //   const { user } = useAuth();
// //   const [todos, setTodos] = useState([]);
// //   const [newTodo, setNewTodo] = useState("");
// //   const [error, setError] = useState(null);

// //   const [sortBy, setSortBy] = useState("id");        // למיון
// //   const [searchTerm, setSearchTerm] = useState("");   // לחיפוש
// //   const [searchBy, setSearchBy] = useState("title");  // קריטריון חיפוש

// //   // ---------- GET TODOS ----------
// //   useEffect(() => {
// //     if (!user) return;

// //     apiRequest(`/todos?userId=${user.id}`)
// //       .then(data => setTodos(data))
// //       .catch(err => setError(err.message));
// //   }, [user]);

// //   // ---------- POST TODO ----------
// //   const addTodo = async () => {
// //     if (!newTodo.trim()) return;

// //     try {
// //       const createdTodo = await apiRequest("/todos", {
// //         method: "POST",
// //         body: {
// //           title: newTodo,
// //           completed: false,
// //           userId: user.id,
// //         },
// //       });

// //       setTodos(prev => [...prev, createdTodo]);
// //       setNewTodo("");
// //     } catch (err) {
// //       setError(err.message);
// //     }
// //   };

// //   // ---------- DELETE TODO ----------
// //   const deleteTodo = async (id) => {
// //     if (!window.confirm("Are you sure you want to delete this todo?")) return;

// //     try {
// //       await apiRequest(`/todos/${id}`, { method: "DELETE" });
// //       setTodos(prev => prev.filter(todo => todo.id !== id));
// //     } catch (err) {
// //       setError(err.message);
// //     }
// //   };

// //   // ---------- UPDATE TODO TITLE ----------
// //   const updateTodoTitle = async (id, newTitle) => {
// //     const todoToUpdate = todos.find(t => t.id === id);
// //     if (!todoToUpdate || !newTitle.trim()) return;

// //     try {
// //       const updated = await apiRequest(`/todos/${id}`, {
// //         method: "PUT",
// //         body: { ...todoToUpdate, title: newTitle },
// //       });
// //       setTodos(prev => prev.map(t => t.id === id ? updated : t));
// //     } catch (err) {
// //       setError(err.message);
// //     }
// //   };

// //   // ---------- TOGGLE COMPLETED ----------
// //   const toggleCompleted = async (id) => {
// //     const todoToUpdate = todos.find(t => t.id === id);
// //     if (!todoToUpdate) return;

// //     try {
// //       const updated = await apiRequest(`/todos/${id}`, {
// //         method: "PUT",
// //         body: { ...todoToUpdate, completed: !todoToUpdate.completed }
// //       });
// //       setTodos(prev => prev.map(t => t.id === id ? updated : t));
// //     } catch (err) {
// //       setError(err.message);
// //     }
// //   };

// //   // ---------- SORT & FILTER ----------
// //   const sortedTodos = [...todos].sort((a, b) => {
// //     if (sortBy === "id") return a.id - b.id;
// //     if (sortBy === "title") return a.title.localeCompare(b.title);
// //     if (sortBy === "completed") return (a.completed === b.completed) ? 0 : a.completed ? 1 : -1;
// //     return 0;
// //   });

// //   const filteredTodos = sortedTodos.filter(todo => {
// //     if (searchBy === "id") return todo.id.toString().includes(searchTerm);
// //     if (searchBy === "title") return todo.title.toLowerCase().includes(searchTerm.toLowerCase());
// //     if (searchBy === "completed") {
// //       if (searchTerm.toLowerCase() === "done") return todo.completed;
// //       if (searchTerm.toLowerCase() === "pending") return !todo.completed;
// //     }
// //     return true;
// //   });

// //   return (
// //     <div>
// //       <h2>Todos</h2>

// //       {error && <p style={{ color: "red" }}>{error}</p>}

// //       {/* ---------- הוספת TODO ---------- */}
// //       <input
// //         value={newTodo}
// //         onChange={e => setNewTodo(e.target.value)}
// //         placeholder="New todo"
// //       />
// //       <button onClick={addTodo}>Add</button>

// //       {/* ---------- חיפוש ---------- */}
// //       <input
// //         placeholder="Search..."
// //         value={searchTerm}
// //         onChange={e => setSearchTerm(e.target.value)}
// //         style={{ marginLeft: "10px" }}
// //       />
// //       <select value={searchBy} onChange={e => setSearchBy(e.target.value)}>
// //         <option value="id">ID</option>
// //         <option value="title">Title</option>
// //         <option value="completed">Completed</option>
// //       </select>

// //       {/* ---------- מיון ---------- */}
// //       <select value={sortBy} onChange={e => setSortBy(e.target.value)} style={{ marginLeft: "10px" }}>
// //         <option value="id">Sort by ID</option>
// //         <option value="title">Sort by Title</option>
// //         <option value="completed">Sort by Completed</option>
// //       </select>

// //       {/* ---------- רשימת TODOS ---------- */}
// //       <ul>
// //         {filteredTodos.map(todo => (
// //           <li key={todo.id} style={{ margin: "5px 0" }}>
// //             <input
// //               type="checkbox"
// //               checked={todo.completed}
// //               onChange={() => toggleCompleted(todo.id)}
// //             />
// //             <span style={{ marginLeft: "5px" }}>
// //               ID: {todo.id} | Title:
// //               <input
// //                 value={todo.title}
// //                 onChange={e => updateTodoTitle(todo.id, e.target.value)}
// //                 style={{ marginLeft: "5px" }}
// //               /> | UserID: {todo.userId}
// //             </span>
// //             <button onClick={() => deleteTodo(todo.id)} style={{ marginLeft: "10px" }}>❌</button>
// //           </li>
// //         ))}
// //       </ul>
// //     </div>
// //   );
// // };

// // export default Todos;















// import { useEffect, useState } from "react";
// import { apiRequest } from "../../../services/api";
// import { useAuth } from "../../../context/AuthContext";
// import { useHttp } from "../../../hook/useHttp";

// const Todos = () => {
//   const { user } = useAuth();

//   const [todos, setTodos] = useState([]);
//   const [newTodo, setNewTodo] = useState("");

//   // מיון + חיפוש (דרישות)
//   const [sortBy, setSortBy] = useState("id"); // id | title | completed
//   const [searchValue, setSearchValue] = useState("");
//   const [searchType, setSearchType] = useState("title");


//   const {
//     sendRequest,
//     isLoading,
//     error,
//     clearError,
//   } = useHttp();

//   // ---------- GET TODOS (של המשתמש הפעיל בלבד) ----------
//   useEffect(() => {
//     if (!user) return;

//     const fetchTodos = async () => {
//       try {
//         const data = await sendRequest(() =>
//           apiRequest(`/todos?userId=${user.id}`)
//         );
//         setTodos(data);
//       } catch (err) {
//         // השגיאה מנוהלת ע"י useHttp
//       }
//     };

//     fetchTodos();
//   }, [user, sendRequest]);

//   // ---------- POST TODO ----------
//   const addTodo = async () => {
//     if (!newTodo.trim()) return;

//     try {
//       const createdTodo = await sendRequest(() =>
//         apiRequest("/todos", {
//           method: "POST",
//           body: {
//             title: newTodo,
//             completed: false,
//             userId: user.id,
//           },
//         })
//       );

//       setTodos(prev => [...prev, createdTodo]);
//       setNewTodo("");
//     } catch (err) {}
//   };

//   // ---------- DELETE TODO ----------
//   const deleteTodo = async (id) => {
//     try {
//       await sendRequest(() =>
//         apiRequest(`/todos/${id}`, { method: "DELETE" })
//       );

//       setTodos(prev => prev.filter(todo => todo.id !== id));
//     } catch (err) {}
//   };

//   // ---------- TOGGLE COMPLETED ----------
//   const toggleCompleted = async (id) => {
//     const todoToUpdate = todos.find(t => t.id === id);
//     if (!todoToUpdate) return;

//     try {
//       const updatedTodo = await sendRequest(() =>
//         apiRequest(`/todos/${id}`, {
//           method: "PUT",
//           body: {
//             ...todoToUpdate,
//             completed: !todoToUpdate.completed,
//           },
//         })
//       );
//     //   const updateTitle = async (todo) => {
//     // const newTitle = prompt("כותרת חדשה:", todo.title);
//     // if (!newTitle) return;

//     // try {
//     //   const updatedTodo = await sendRequest(() =>
//     //     apiRequest(`/todos/${todo.id}`, {
//     //       method: "PUT",
//     //       body: { ...todo, title: newTitle },
//     //     })
//     //   );

//       setTodos(prev =>
//         prev.map(t => (t.id === id ? updatedTodo : t))
//       );
//     } catch (err) {}
//   };

//   // ---------- FILTER + SORT (דרישות חלק ד') ----------
//   const displayedTodos = todos
//     .filter(todo =>
//       todo.title.toLowerCase().includes(searchValue.toLowerCase())
//     )
//     .sort((a, b) => {
//       if (sortBy === "title") {
//         return a.title.localeCompare(b.title);
//       }
//       if (sortBy === "completed") {
//         return a.completed - b.completed;
//       }
//       return a.id - b.id;
//     });

//   return (
//     <div>
//       <h2>Todos של {user?.username}</h2>

//       {isLoading && <p>טוען...</p>}

//       {error && (
//         <div style={{ color: "red" }}>
//           <p>{error}</p>
//           <button onClick={clearError}>סגור</button>
//         </div>
//       )}

//       {/* --- הוספת todo --- */}
//       <input
//         value={newTodo}
//         onChange={e => setNewTodo(e.target.value)}
//         placeholder="New todo"
//       />
//       <button onClick={addTodo}>Add</button>

//       {/* --- חיפוש + מיון --- */}
//       <div>
//         <input
//           placeholder="חיפוש לפי כותרת"
//           value={searchValue}
//           onChange={e => setSearchValue(e.target.value)}
//         />

//         <select value={sortBy} onChange={e => setSortBy(e.target.value)}>
//           <option value="id">מיון לפי ID</option>
//           <option value="title">מיון לפי כותרת</option>
//           <option value="completed">מיון לפי ביצוע</option>
//         </select>
//       </div>

//       {/* --- רשימת todos --- */}
//       <ul>
//         {displayedTodos.map(todo => (
//           <li key={todo.id}>
//             {todo.id} - {todo.title}

//             <button onClick={() => deleteTodo(todo.id)}>❌</button>

//             <input
//               type="checkbox"
//               checked={todo.completed}
//               onChange={() => toggleCompleted(todo.id)}
//             />
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// };

// export default Todos;















