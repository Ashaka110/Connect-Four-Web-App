import { useState, useEffect } from "react";
import "./App.css";
import axios from "axios";
import { io } from "socket.io-client";

const socket = io("http://localhost:3000");

function App() {
  const [code, setCode] = useState("");
  const [joinedCode, setJoinedCode] = useState("");
  const [name, setName] = useState("");
  const [players, setPlayers] = useState<{
    player_one_name?: string;
    player_two_name?: string;
  }>({});

  const createLobby = async () => {
    const { data } = await axios.post("http://localhost:3000/lobbies");
    console.log(data);
    setJoinedCode(data.code);
  };

  const joinLobby = async () => {
    await axios.post("http://localhost:3000/lobbies/join", {
      code,
    });

    setJoinedCode(code);
  };

  useEffect(() => {
    if (!joinedCode || !name) return;

    socket.emit("joinLobby", {
      code: joinedCode,
      name,
    });

    socket.on("lobbyUpdate", (data) => {
      setPlayers(data);
    });

    socket.on("errorMessage", (msg) => {
      alert(msg);
      //clear codes
      setJoinedCode("");
      setCode("");
    });

    return () => {
      socket.off("playerJoined");
      socket.off("lobbyUpdate");
      socket.off("errorMessage");
    };
  }, [joinedCode, name]);

  if (joinedCode) {
    return (
      <div style={{ padding: 40 }}>
        <h2>Lobby Code: {joinedCode}</h2>

        <h3>Players:</h3>
        <p>Player 1: {players.player_one_name || "Waiting..."}</p>
        <p>Player 2: {players.player_two_name || "Waiting..."}</p>
      </div>
    );
  }

  return (
    <div style={{ padding: 40 }}>
      <h2>Enter Your Name</h2>
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Your Name"
      />

      <div style={{ marginTop: 20 }}>
        <button onClick={createLobby} disabled={!name}>
          Create Lobby
        </button>
      </div>

      <div style={{ marginTop: 20 }}>
        <input
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase())}
          placeholder="Enter Code"
        />
        x{" "}
        <button onClick={joinLobby} disabled={!name}>
          Join Lobby
        </button>
      </div>
    </div>
  );
}

export default App;
