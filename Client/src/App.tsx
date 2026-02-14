import { useState, useEffect } from "react";
import "./App.css";
import axios from "axios";

interface User {
  id: number;
  name: string;
  email: string;
}

function App() {
  const [users, setUsers] = useState<User[]>([]);
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");

  const fetchUsers = async () => {
    try {
      const response = await axios.get<User[]>("http://localhost:5000/users");
      setUsers(response.data);
    } catch (err) {
      console.error(err);
    }
  };

  // Add a new user
  const addUser = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post<User>("http://localhost:5000/users", {
        name,
        email,
      });
      setUsers([...users, response.data]);
      setName("");
      setEmail("");
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <>
      <h1>Users</h1>
      <ul>
        {users.map((user) => (
          <li key={user.id}>
            {user.name} - {user.email}
          </li>
        ))}
      </ul>

      <h2>Add User</h2>
      <form onSubmit={addUser}>
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button type="submit">Add User</button>
      </form>
    </>
  );
}

export default App;
