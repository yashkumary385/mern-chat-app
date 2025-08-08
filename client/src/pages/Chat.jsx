import React from 'react'
import { io } from 'socket.io-client'
import axios from "axios";
import { useEffect, useState } from 'react'
import { useUser } from '../hooks/useUser';
import { useRef } from 'react';
import { use } from 'react';
const socket = io("http://localhost:5000") // this tells us about our backend from where the request comes

const Chat = () => {
  const { user, token, logout } = useUser();
   const [isTyping , setIsTyping] = useState(false)
   const typingTimeoutRef = useRef(null)
  const [users, setUsers] = useState([])
  const [msg, setMsg] = useState("");
  const [messages, setMessages] = useState([]);
  const [person, setPerson] = useState(()=> localStorage.getItem("person") || null)
  const[isOnlineUsers , SetIsOnlineUsers] = useState([])
  const[isOnline , SetIsOnline] = useState(false)

  // socket.on("message")
  //  console.log(user)
  useEffect(()=>{
    if(user?.username) return;

// socket.on("connect", ()=>{
  console.log(user)
  socket.emit("register",user?.username)
// })
//  return () => {
//     socket.off("connect");
//   };
  },[user]) // context didnt load if depdndecy emptty hence no user then nothing send hence crash occurs 

  const sendMessage = () => {
    console.log(user)
    socket.emit("chat-message",
      {
        sender: user?.username,
        text: msg,
        reciever: person
      })
    setMsg("")  // we take from the frontend user or client 
  }
  const fetchMessages = async () => {
    try {
      const res = await axios(`http://localhost:5000/api/messages/${user?.username}/${person}`);
      console.log(res)
      setMessages(res.data)
    } catch (error) {
      console.log(error)
    }
  }
  useEffect(() => {
    if(user?.username && person){
    setMessages([])
   fetchMessages();
    }
  }, [person,user])  // only when depedndcy changes and doesnt run on every render 
  // because user might not be available so it waits for the user to be available and then  caals function
  // pu useeffct
  useEffect(() => { // a msg coming from the server and event chat-message 
      socket.on('chat-message',(incomingMsg) => {
      setMessages((prev) => [...prev, incomingMsg]);
    });

    socket.on("typing" , ({sender , reciever})=>{
      if(reciever === user?.username){
        setIsTyping(true)
      }
    })
    socket.on("Not typing" , ({sender , reciever})=>{
      if(reciever === user?.username){
        setIsTyping(false)
      }
    })

    return () => {
      socket.off('chat-message');
      socket.off("typing")
      socket.off("Not typing")
     
    };
  }, [person,user]);
 useEffect(()=>{
    socket.on("user-online",(username)=>{
SetIsOnlineUsers((prev) => prev.includes(username) ? prev : [...prev, username]);
    } )
    socket.on("online-users",(users)=>{
      SetIsOnlineUsers(users)
    } )
    socket.on("user-offline",(username)=>{ // remove the user from the isonline array
      SetIsOnlineUsers((prev)=> prev.filter((u)=> u !== username))
    } )
    return ()=>{
       socket.off("user-online")
       socket.off("online-users")
      socket.off("user-offline")
    }
 },[])
  useEffect(() => {
    const fetchAllUsers = async () => {
      // console.log(user)
      try {
        const res = await axios.get("http://localhost:5000/api/auth/allUsers", {
          headers: { Authorization: `Bearer ${token}` },
        }
        )
        console.log(res)
        setUsers(res.data.user)
        // console.log(users)


      } catch (error) {
        console.log(error)
      }
    }
    fetchAllUsers()
  }
    , [])


    useEffect(()=>{
      console.log(person)
      console.log(isOnlineUsers)
    },[])


const handleUser = (e)=>{
const selectedPerson = e.target.value
setPerson(e.target.value)
localStorage.setItem("person",selectedPerson)
}


const handleExit = ()=>{
localStorage.removeItem("person")
setPerson(null)
}


const handleLogout = ()=>{
localStorage.removeItem("person")
logout()

}
const handleTyping = (e)=>{
  setMsg(e.target.value);
  socket.emit("typing" , {sender:user , reciever:person} )
  clearTimeout(typingTimeoutRef.current)
  typingTimeoutRef.current = setTimeout(()=>{
    socket.emit("Not typing" ,{sender:user , reciever:person} )
  }, 1000)
}
  return (

    <div className="min-h-screen bg-gray-100 p-4">
      {user?.username}
      <h1 className="text-2xl font-bold mb-4">Simple Chat</h1>
      <div>Users

        <select onChange={(e)=> handleUser(e)} value={person || ""} >
            <option value="" disabled>Select a user to chat with</option>
          {
            users
            .filter((u)=> u?.username !== user?.username)
            .map((u) => {
return <option key={u._id} value={u.username}>
  {u.username}{isOnlineUsers.includes(u.username) && '🟢'}
</option>
            })
          }
        </select>

      </div>
      { person ? (
      <div className="bg-white p-4 rounded shadow-md max-w-md mx-auto">
        Chat App
        <div className="h-64 overflow-y-auto border p-2 mb-2">
          {messages.map((m, i) => (
            <div key={i} className="mb-1 text-sm">{m.text}
              {m.sender}
            </div>
            
          ))}
        {isTyping && <div>{person} is typing</div>}

        </div>


        <div className="flex gap-2">
          <input 
        
            className="flex-1 border px-2 py-1 rounded"
            value={msg}
            onChange={ handleTyping}
            placeholder="Type your message..."
          />
          <button
        
            className="bg-blue-500 text-white px-4 py-1 rounded"
            onClick={sendMessage}
          >
            Send
          </button>
          
        </div>
        <button onClick={handleExit}>Exit chat</button>
      </div>
      ) : <div>hiii</div>}
      <button onClick={handleLogout}>Logout</button>
    </div>
  );

}

export default Chat
