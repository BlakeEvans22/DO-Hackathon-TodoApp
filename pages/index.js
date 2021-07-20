import { useState, useEffect } from "react";

export default function Todos() {
  const [newTodo, setNewTodo] = useState("");
  const [todos, setTodos] = useState([]);
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

  useEffect(() => {
    console.log(baseUrl);
    getTodos();
  }, []);

  const getTodos = async () => {
    try {
      fetch(`${baseUrl}/api/todo`)
        .then((response) => response.json())
        .then((data) => setTodos(data));
    } catch (error) {
      alert(error);
    }
  };

  const addTodo = async () => {
    try {
      await fetch(`${baseUrl}/api/todo`, {
        body: JSON.stringify({
          newTodo,
        }),
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
      });
      getTodos();
    } catch (error) {
      alert(error);
    }
  };

  const deleteTodo = async (id) => {
    try {
      await fetch(`${baseUrl}/api/todo`, {
        body: JSON.stringify({
          id,
        }),
        headers: {
          "Content-Type": "application/json",
        },
        method: "DELETE",
      });

      getTodos();
    } catch (error) {
      alert(error);
    }
  };

  const changeComplete = async (id, complete) => {
    try {
      await fetch(`${baseUrl}/api/todo`, {
        body: JSON.stringify({
          id,
          complete,
        }),
        headers: {
          "Content-Type": "application/json",
        },
        method: "PUT",
      });

      getTodos();
    } catch (error) {
      alert(error);
    }
  };

  return (
    <div>
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <div className="container-fluid">
          <a className="navbar-brand" href="#">
            Todo App
          </a>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
        </div>
      </nav>
      <div className="p-3">
        <h1>Todos</h1>
        {todos.length > 0 ? (
          <ul>
            {todos.map((todo) => (
              <li key={todo._id}>
                <h3
                  onClick={() => changeComplete(todo._id, !todo.complete)}
                  style={{
                    textDecoration: todo.complete == true && "line-through",
                  }}
                >
                  {todo.name}
                  <button onClick={() => deleteTodo(todo._id)} type="button">
                    X
                  </button>
                </h3>
              </li>
            ))}
          </ul>
        ) : (
          <h4 style={{ color: "black" }}>No Todos!</h4>
        )}
      </div>
      <div className="p-3">
        <h1>Add Todo</h1>
        <button onClick={() => addTodo()}>Add</button>
        <input
          type="input"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
        ></input>
      </div>
    </div>
  );
}
