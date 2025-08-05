import express from "express"
import http from "http" // to resolve the request
import { Server } from "socket.io";
import cors from "cors"
import mongoose from "mongoose";
import Message from "./models/Message.js";
const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const io = new Server(server, { // // we make an server and this is ws server for the frontnd 
    cors: {
        origin: "http://localhost:5173", /// tells from where to accept the request from 
        methods: ["GET", "POST"]
    }
})
io.on('connection', async (socket) => {
    console.log('User connected:', socket.id);

    //   const messages = await Message.find().sort({timestamp:1})

    //   socket.emit("chat history" , messages)

    socket.on('chat-message', async (msg) => { // chat meeage vent should be same from both the ends==
        console.log(msg)
        await Message.create(msg)
        io.emit('chat-message', msg);
    });


    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });

})


app.use("/api/messages/:user1/:user2", async (req, res) => {
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



