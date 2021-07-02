import { connectToDatabase } from "../util/mongodb";

export default function Todos({ todos }) {
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
        <ul>
          {todos.map((todo) => (
            <li key={todo._id}>
              <h2>
                {todo.name}-{todo.complete}
              </h2>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export async function getServerSideProps() {
  const { db } = await connectToDatabase();

  const todos = await db.collection("todos").find({}).limit(20).toArray();

  return {
    props: {
      todos: JSON.parse(JSON.stringify(todos)),
    },
  };
}
