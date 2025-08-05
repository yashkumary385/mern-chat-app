import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import { io } from 'socket.io-client'
import './App.css'
import { useEffect } from 'react'
import axios from "axios";
const username = prompt("enter you name");
localStorage.setItem("username" , username)
const recievername = prompt("enter reciever name");

const socket = io("http://localhost:5000") // this tells us about our backend from where the request comes
function App() {
  const [msg , setMsg] = useState("");
  const [messages, setMessages] = useState([]);
  // socket.on("message")
  const sendMessage = ()=>{
    console.log("yess")
    socket.emit("chat-message" , 
      {
      sender:username,
      text :msg,
      reciever:recievername
  })
    setMsg("")  // we take from the frontend user or client 
  }
    const fetchMessages = async(user1 , user2)=>{
      try {
          const res = await axios(`http://localhost:5000/api/messages/${user1}/${user2}`);
      console.log(res)
      setMessages(res.data)
      } catch (error) {
        console.log(error)
      }
    }
  useEffect(()=>{
if(username && recievername){
  fetchMessages(username, recievername)
}
  },[username , recievername])
   useEffect(() => {
  

    socket.on('chat-message', (incomingMsg) => {
      setMessages((prev) => [...prev, incomingMsg]);
    });

  return () => {
 socket.off('chat-message');
  };


  }, []);
 

return (
    <div className="min-h-screen bg-gray-100 p-4">
      <h1 className="text-2xl font-bold mb-4">Simple Chat</h1>

      <div className="bg-white p-4 rounded shadow-md max-w-md mx-auto">
        <div className="h-64 overflow-y-auto border p-2 mb-2">
          {messages.map((m, i) => (
            <div key={i} className="mb-1 text-sm">{m.text}  
            {m.sender}
            
            </div>
          ))}
        </div>

        <div className="flex gap-2">
          <input
            className="flex-1 border px-2 py-1 rounded"
            value={msg}
            onChange={(e) => setMsg(e.target.value)}
            placeholder="Type your message..."
          />
          <button
            className="bg-blue-500 text-white px-4 py-1 rounded"
            onClick={sendMessage}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

export default App
 // chats between two users has been renderd now make ui beeter and userschme ans securities and revise this .