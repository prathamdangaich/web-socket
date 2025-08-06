import React, { useEffect, useState, useMemo } from 'react'
import {io} from "socket.io-client"
import {Container, Typography, TextField, Button, Stack} from "@mui/material"
function App() {
  const socket = useMemo(() => io("http://localhost:3000"), []);

  const [message, setMessage] = useState("");
  const [room, setRoom] = useState("");
  const [socketId, setSocketId] = useState("");
  const [messages, setMessages] = useState([]);
  const [roomName, setRoomName] = useState("");

  console.log(messages);
  
  useEffect( () => {
    socket.on("connect", () => {
      console.log("connected to server, Socket_Id:",socket.id)
      setSocketId(socket.id);
    });

    socket.on("welcome",(s)=> {
      console.log(s)
    });

    socket.on("receive-message",(data)=> {
      console.log(data);
      setMessages((messages) => [...messages, data]);
    });

    return ()=> {
      socket.disconnect();
    }
  }, [])

  
  const handleSubmit = (e) => {
    e.preventDefault();
    socket.emit("message", {message,room});
    setMessage("");
  };

  const joinRoomHandler = (e) => {
    e.preventDefault();
    socket.emit("join-room", roomName);
    setRoomName("");
  }
  
 
 
  return (
    <Container>
      <Typography variant="h3" component="div" gutterBottom>
        Welocme to Socket.io
      </Typography>

      <Typography variant="h6" component="div" gutterBottom>
        {socketId}
      </Typography>

      <form onSubmit={joinRoomHandler}>
        <h5>Join Room</h5>
        <TextField 
          value={roomName} 
          onChange={(e)=> setRoomName(e.target.value)} 
          id="outlined-basic" 
          label="Room Name" 
          variant="outlined" 
        />
        
        <Button type="submit" variant="contained" color="primary">Join</Button>
      </form>

      <form onSubmit={handleSubmit}>
        <TextField 
          value={message} 
          onChange={(e)=> setMessage(e.target.value)} 
          id="outlined-basic" 
          label="Message" 
          variant="outlined" 
        />

        <TextField 
          value={room} 
          onChange={(e)=> setRoom(e.target.value)} 
          id="outlined-basic" 
          label="Room" 
          variant="outlined" 
        />
        
        <Button type="submit" variant="contained" color="primary">Send</Button>
      </form>

      <Stack>
        {messages.map((message, index) => (
          <Typography key={index}> {message} </Typography>
        ))}
      </Stack>

      
    </Container>
  )
}

export default App
