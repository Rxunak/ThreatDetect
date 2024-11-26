import Navbar from "../components/Navbar";
import TextAnalysis from "../components/TextAnalysis";
import Footer from "../components/Footer";
import io from "socket.io-client";
import { useState } from "react";

// const socket = io("http://localhost:5001");

const TextualAnalysisPage = () => {
  // const [username, setUsername] = useState();

  // const [room, setRoom] = useState();

  // const [showChat, setShowChat] = useState(false);

  // const joinRoom = () => {
  //   if (username !== "" && room !== "") {
  //     socket.emit("join_room", room);
  //     setShowChat(true);
  //   }
  // };
  return (
    <div>
      <Navbar />
      <div>
        {/* {!showChat ? (
          <div>
            <h3>Joing A chat</h3>
            <input
              type="text"
              placeholder="Raunak..."
              onChange={(event) => {
                setUsername(event.target.value);
              }}
            />
            <input
              type="text"
              placeholder="Room ID.."
              onChange={(event) => {
                setRoom(event.target.value);
              }}
            />
            <button onClick={joinRoom}>Joing A Room</button>
          </div>
        ) : (
          <TextAnalysis socket={socket} username={username} room={room} />
        )} */}

        <TextAnalysis />
      </div>

      <Footer />
    </div>
  );
};

export default TextualAnalysisPage;
