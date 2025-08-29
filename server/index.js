import express from "express"
import http from "http" // to resolve the request
import { Server } from "socket.io";
import cors from "cors"
import mongoose from "mongoose";
import Message from "./models/Message.js";
import { verifyToken } from "./middleware/authMiddleware.js";
import User from "./models/User.js";
const app = express();
app.use(cors());
app.use(express.json());
const onlineUsers = {} // this gets completely reset on refresh frontend repopulates and runs regiter to fill the array 
const lastSeen = {}
const allUsers ={} // for all users that register no matter they are shown offline or online . beacuse of their mode .
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
app.use("/api/auth", authRoutes);

io.on('connection', async (socket) => {
    console.log('User connected:', socket.id);

    //   const messages = await Message.find().sort({timestamp:1})

    //   socket.emit("chat history" , messages)


    socket.on("register", (username, status) => {// this is to listen the regitser event added the users to the online users list with the key and value pair 
       delete onlineUsers[username];
        if (status !== "invisible") {
        // Don't include them in the public onlineUsers list
        onlineUsers[username] = socket.id;
          delete lastSeen[username]
        io.emit("last-seen-online", lastSeen)
    
    } else {
            delete onlineUsers[username];

    }
        // onlineUsers[username] = socket.id
       // delete when the user is online 
        // io.emit("user-online", username)
             allUsers[username] = socket.id;
        console.log(`${username} is registered with socket ID and added to the online users with  ${socket.id}`);
        //  const alreadyOnline = Object.keys(onlineUsers).filter((u)=> (u !== username))
        io.emit("online-users", Object.keys(onlineUsers))
        console.log(onlineUsers)
        console.log(allUsers)
    })


    // chat messsage sendde only yo rciver with his socekt id better fro efficiency  and also to the user
    socket.on('chat-message', async (msg) => { // chat mee  event should be same from both the ends==
        console.log(msg)
        await Message.create(msg)
        const recieverSocketId = allUsers[msg.reciever]
        console.log(recieverSocketId, "this is socekt id reciver")

        if (recieverSocketId) {
            console.log(`this is the ${recieverSocketId}`)
            io.to(recieverSocketId).emit('chat-message', msg); // msg from the frontned passed on to the users 
        }
        const senderSocketId = allUsers[msg.sender]
        if (senderSocketId) {
            io.to(senderSocketId).emit('chat-message', msg); // msg from the frontned passed on to the users 
        }
        // io.emit("chat-message",msg) 
    });
    socket.on("typing", ({ sender, reciever }) => { // only to the reciever  

        const recieverSocketId = allUsers[reciever]
        console.log(recieverSocketId, "this is socekt id reciver")

        if (recieverSocketId) {
            io.to(recieverSocketId).emit("typing", { sender, reciever });
        }
    })
    socket.on("not-typing", ({ sender, reciever }) => {
        console.log("hii")
        const recieverSocketId = allUsers[reciever]
        if (recieverSocketId) {
            io.to(recieverSocketId).emit("not-typing", { sender, reciever });
        }
    })
    console.log("this is the last seen", lastSeen)

    socket.on('disconnect', () => { // when user closes the tab
        console.log('User disconnected:', socket.id);
        // this doesnt runs on backend refresh because online users is zero 
        for (const username in onlineUsers) {
            if (onlineUsers[username] === socket.id) { // match the socket id with the current onlineUsers socket id 
                delete onlineUsers[username];
                lastSeen[username] = new Date().toISOString(); //addedd last seen whne user disconnected
                io.emit("user-offline", username);
                io.emit("online-users", Object.keys(onlineUsers)) // new onlineUsers list 
                // io.emit("last-seen", { username, time: lastSeen[username] })
                console.log("this is the last seen", lastSeen)

                console.log(`${username} removed from online users.`);
                break;
            }
        }
    });
})

                console.log("this is the last seen", lastSeen)

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
// look at this 
app.use("/api/status", verifyToken,async(req,res)=>{
    const userId = req.user.id;
    const {status} = req.body;
try {
    const updated = await User.findByIdAndUpdate(userId , {
        status:status
        
    },{new:true})
    res.status(200).json(updated)
} catch (error) {
    res.status(404).json({message: error})
}

})
app.use("/api/read/:sender/:reciever", verifyToken,async(req,res)=>{
    const {sender , reciever} = req.params
   
try {
    const messages = await Message.find({ sender , reciever, read:false }).sort({ timestamp: 1 });
   messages.forEach((msg)=> msg.read = true)
   for(const msg of messages){
    msg.read= true;
    msg.save();
   }
      res.status(200).json({ message: "Messages marked as read", updatedCount: messages.length });
} catch (error) {
    res.status(404).json({message: error})
}
})

app.use("/api/deleteChat/:user1/:user2", verifyToken, async (req, res) => {
    const { user1, user2 } = req.params;
    try {
        // Delete messages where user1 and user2 are sender/receiver pairs
        const result = await Message.deleteMany({
            $or: [
                { sender: user1, reciever: user2 },
                { sender: user2, reciever: user1 }
            ]
        });
        res.status(200).json({ message: "Deleted Successfully", deletedCount: result.deletedCount });
    } catch (error) {
        res.status(404).json({ message: error });
    }
})


mongoose.connect("mongodb+srv://admin:admin123@cluster0.mypt7no.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
    .then(() => {
        console.log("Connected to mongo")
    })
    .catch((err) => {
        console.log(err)

    })
    app.delete("/api/message/:id", verifyToken, async (req, res) => {
        // console.log("delete route hitt")
    const { id } = req.params;
    try {
        const result = await Message.findByIdAndDelete(id);
        if (!result) {
            return res.status(404).json({ message: "Message not found" });
        }
        res.status(200).json({ message: "Message deleted successfully" });
    } catch (error) {
        res.status(404).json({ message: error });
    }
});
    app.put("/api/message/:id", verifyToken, async (req, res) => {
        // console.log("delete route hitt")
    const { id } = req.params;
    const {text} = req.body;
    try {
        const result = await Message.findByIdAndUpdate(id,{
            text:text
        });
        if (!result) {
            return res.status(404).json({ message: "Message not found" });
        }
        res.status(200).json({ message: "Message updated successfully" });
    } catch (error) {
        res.status(404).json({ message: error });
    }
});

server.listen(5000, () => {
    console.log("5000 is the port")
})



