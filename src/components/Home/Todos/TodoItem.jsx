function TodoItem({ todo, onToggle, onDelete, onUpdate }) {
  return (
    <li className="todo-item">
      <span>{todo.id}</span>
      <input
        type="checkbox"
        checked={todo.completed}
        onChange={() => onToggle(todo)}
      />
      <span style={{ textDecoration: todo.completed ? "line-through" : "none" }}>
        {todo.title}
      </span>
     
      <div className="actions">
         <button onClick={() => onUpdate(todo)}>📝</button>
         <button onClick={() => onDelete(todo.id)}>🗑️</button>
      </div>
    </li>
  );
}
export default TodoItem;