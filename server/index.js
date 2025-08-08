import express from "express"
import http from "http" // to resolve the request
import { Server } from "socket.io";
import cors from "cors"
import mongoose from "mongoose";
import Message from "./models/Message.js";
const app = express();
app.use(cors());
app.use(express.json());
const onlineUsers={}
// {
//   "alice": "4dx03K9fB8s1PvAeAAAC",
//   "bob":   "0qv8oWrRV5bVUg9nAAAB",
//   "charlie": "sdl0R3QmT9XkPz9CAAAD"
// }
const server = http.createServer(app);
const io = new Server(server, { // // we make an server and this is ws server for the frontnd 
    cors: {
        origin: "http://localhost:5173", /// tells from where to accept the request from 
        methods: ["GET", "POST"]
    }
})
import authRoutes from "./routes/auth.routes.js"
app.use("/api/auth" , authRoutes);

io.on('connection', async (socket) => {
    console.log('User connected:', socket.id);

    //   const messages = await Message.find().sort({timestamp:1})

    //   socket.emit("chat history" , messages)
       
    socket.on("register" , (username)=>{
        onlineUsers[username] = socket.id
         console.log(`${username} is registered with socket ID ${socket.id}`);
         io.emit("user-online" , username)
    })

// chat messsage sendde only yo rciver with his socekt id better fro efficiency  and also to the user
    socket.on('chat-message', async (msg) => { // chat mee  event should be same from both the ends==
        console.log(msg)
        await Message.create(msg)
          
        const recieverSocketId =onlineUsers[ msg.reciever]
        if(recieverSocketId){
        io.to(recieverSocketId).emit('chat-message', msg); // msg from the frontned passed on to the users 
        }
        const senderSocketId =onlineUsers[msg.sender]
        if(senderSocketId){
        io.to(senderSocketId).emit('chat-message', msg); // msg from the frontned passed on to the users 
        }
    });

    
    socket.on("typing" , ({sender, reciever})=>{
        const recieverSocketId =onlineUsers[reciever]
        if(recieverSocketId){
        io.to(recieverSocketId).emit("typing" , {sender , reciever} );
        }
    })
     socket.on("Not typing" , ({sender, reciever})=>{
        const recieverSocketId =onlineUsers[reciever]
        if(recieverSocketId){
        io.to(recieverSocketId).emit("Not typing" , {sender , reciever} );
        }
    })

    socket.on('disconnect', () => { // when user closes the tab
        console.log('User disconnected:', socket.id);
        
 for (const username in onlineUsers) {
    if (onlineUsers[username] === socket.id) { // match the socket id with the current onlineUsers socket id 
      delete onlineUsers[username];
      io.emit("user-offline", username);

      console.log(`${username} removed from online users.`);
      break;
    }
  }
    });



})


app.use("/api/messages/:user1/:user2", async (req, res) => { // controller and route in one 
    try {
         const { user1, user2 } = req.params;
    const messages = await Message.find({
        $or: [
            { sender: user1, reciever: user2 },
            { sender: user2, reciever: user1 }
        ]
    }).sort({ timestamp: 1 });

    return res.status(200).json(messages)
    } catch (error) {
        console.log(error)
    }
   



}


)
mongoose.connect("mongodb+srv://admin:admin123@cluster0.mypt7no.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
    .then(() => {
        console.log("Connected to mongo")
    })
    .catch((err) => {
        console.log(err)

    })

server.listen(5000, () => {
    console.log("5000 is the port")
})



