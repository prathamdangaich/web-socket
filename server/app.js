import express from "express";
import {Server} from "socket.io";
import {createServer} from "http";
import cors from "cors";

const app = express();
const server = createServer(app);
const io = new Server(server, {
    cors:{
        origin:"http://localhost:5173",
        methods:["GET", "POST"],
        credentials:true,
    }
})

const port=3000;

app.use(
    cors({
    origin:"http://localhost:5173",
    methods:["GET", "POST"],
    credentials:true,
})
);


app.get("/", (req,res)=>{
    res.send("Hello world!");
});

io.on("connection", (socket) => {
    console.log("User Connected!! Id: ", socket.id);

    socket.on("message", ({message,room}) => {
        console.log({message,room});
        socket.to(room).emit("receive-message",message)
        //socket.broadcast.emit("receive-mesaage",{message,room});
    })

    socket.on("join-room", (room)=> {
        socket.join(room);
        console.log(`user ${socket.id} joined room ${room}`);
    })

    socket.on("disconnect", ()=> {
        console.log("User dsiconnected", socket.id);
    })
})

server.listen(port, ()=>{
    console.log(`Server is running on port ${port}`);
});
