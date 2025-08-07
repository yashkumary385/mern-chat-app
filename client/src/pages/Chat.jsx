import React from 'react'
import { io } from 'socket.io-client'
import axios from "axios";
import { useEffect , useState } from 'react'
import { useUser } from '../hooks/useUser';
const socket = io("http://localhost:5000") // this tells us about our backend from where the request comes

const Chat = () => {
  const {user , token , logout} = useUser();

  const [users , setUsers] = useState([])
 const [msg , setMsg] = useState("");
  const [messages, setMessages] = useState([]);
  const [person , setPerson] = useState(null)
  // socket.on("message")
  //  console.log(user)
  const sendMessage = ()=>{
    console.log(person)
    socket.emit("chat-message" , 
      {
      sender:user?.username,
      text :msg,
      reciever:person
  })
    setMsg("")  // we take from the frontend user or client 
  }
    const fetchMessages = async()=>{
      try {
       
          const res = await axios(`http://localhost:5000/api/messages/${user?.username}/${person}`);
      console.log(res)
      setMessages(res.data)
      } catch (error) {
        console.log(error)
      }
    }
    useEffect(()=>{
fetchMessages();
    },[person])
// pu useeffct
   useEffect(() => { // a msg coming from the server and event chat-message 
  

    socket.on('chat-message', (incomingMsg) => {
      setMessages((prev) => [...prev, incomingMsg]);
    });

  return () => {
 socket.off('chat-message');
  };


  }, []);
 
  useEffect(()=>{
  const fetchAllUsers = async()=>{
    console.log(user)
    try {
      const res = await axios.get("http://localhost:5000/api/auth/allUsers",{
           headers: { Authorization: `Bearer ${token}` },
        }
      )
      console.log(res)
      setUsers(res.data.user)
      console.log(users)
    

    } catch (error) {
      console.log(error)
    }
  }
  fetchAllUsers()
  }
  ,[])

  

return (
  
    <div className="min-h-screen bg-gray-100 p-4">
      <h1 className="text-2xl font-bold mb-4">Simple Chat</h1>
      <div>Users
        <select onChange={(e)=> setPerson(e.target.value)}>       
{
  users.map((user)=>{
     return  <option key={user._id} value={user.username}>{user.username}</option>
  })
}
</select>

      </div>

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
    <button onClick={logout}>Logout</button>
    </div>
  );
  return (
    <div>
      
    </div>
  )
}

export default Chat
