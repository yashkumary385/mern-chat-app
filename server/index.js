import express from "express"
import http from "http" // to resolve the request
import { Server } from "socket.io";
import cors from "cors"

const app = express();
app.use(cors());

const server = http.createServer(app);
const io =new Server (server , { // // we make an server and this is ws server for the frontnd 
    cors:{
        origin: "http://localhost:5173", /// tells from where to accept the request from 
        methods:["GET" , "POST"]
    }
}) 
io.on("connection" , socket => {
    
    console.log("user connected", socket.id);

    socket.on("chat-message" , (outgoing)=> { 
        // we recive message from frontnd and pass it on to the user
        console.log(outgoing)

        io.emit("message" , outgoing)

    })
})


server.listen(3000 , ()=>{
    console.log("3000 is the port")
})