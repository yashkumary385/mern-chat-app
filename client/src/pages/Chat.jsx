import React from 'react'
import { io } from 'socket.io-client'
import axios from "axios";
import { useEffect, useState } from 'react'
import { useUser } from '../hooks/useUser';
import ListGroup from 'react-bootstrap/ListGroup';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';


import { useRef } from 'react';
import { use } from 'react';
import ChatNavbar from '../components/Navbar';
const socket = io("http://localhost:5000") // this tells us about our backend from where the request comes

const Chat = () => {
  const { user, token, logout , setUser } = useUser();
  const [isTyping, setIsTyping] = useState(false)
   const [showModal, setShowModal] = useState(false);
  const typingTimeoutRef = useRef(null)
  const [users, setUsers] = useState([])
  const [msg, setMsg] = useState("");
  const [messages, setMessages] = useState([]);
  const [person, setPerson] = useState(() => localStorage.getItem("person") || null)
  const [isOnlineUsers, SetIsOnlineUsers] = useState([])
  const [lastSeenMap, setLastSeenMap] = useState({})
  const [status, setStatus] = useState("invisible");
  const [username, setusername] = useState("")
  const [search, setSearch] = useState(false)
  const [searchedUser, setSearchedUser] = useState([])
const[form , setForm] = useState({
  email:"",
  username:""
})
  useEffect(() => {
    if (!user?.username) return;
    console.log(user)
    socket.emit("register", user?.username, user?.status) // emits an event register whne the user gets loaded in to the memory 
  }, [user]) // context didnt load if depdndecy emptty hence no user then nothing send hence crash occurs 

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
    if (user?.username && person) {
      setMessages([])
      fetchMessages();
    }
  }, [person, user])  // only when depedndcy changes and doesnt run on every render 
  // because user might not be available so it waits for the user to be available and then  caals function
  // pu useeffct
  useEffect(() => { // a msg coming from the server and event chat-message 
    socket.on('chat-message', (incomingMsg) => {
      setMessages((prev) => [...prev, incomingMsg]);
    });

    socket.on("typing", ({ sender, reciever }) => { // we fisrt send the emit through socket emit and then get with on in baceknd an then cacth with on in frontned 
      if (reciever === user?.username) {
        setIsTyping(true)
      }
    })
    socket.on("Not typing", ({ sender, reciever }) => {
      if (reciever === user?.username) {
        setIsTyping(false)
      }
    })
    return () => {
      socket.off('chat-message');
      socket.off("typing")
      socket.off("Not typing")

    };
  }, [person]);
  useEffect(() => {
    socket.on("online-users", (users) => {
      SetIsOnlineUsers(users)
    })
    socket.on("user-offline", (username) => { // remove the user from the isonline array
      SetIsOnlineUsers((prev) => prev.filter((u) => u !== username))
    })

    return () => {
      socket.off("online-users")
      socket.off("user-offline")

    }
  }, [])

 const handleCloseModal = () => {
        setShowModal(false);
    };

const handleDelete = async()=>{
  const confirm = window.confirm("Are you sure you want to delete profile you wont be able to revocer it ?")
  if(!confirm) return;
  try {
    const res = await axios.delete("http://localhost:5000/api/auth/delete",{
      headers : {Authorization :`Bearer ${token}`}
    })
    console.log(res)
  } catch (error) {
    console.log(error)
  }
}

  useEffect(() => {

    socket.on("last-seen-online", (lastSeen) => {
      setLastSeenMap(lastSeen) //last seen is an objct coming from backend
    })
    return () => {

      socket.off("last-seen-online");
    }
  }, [])


  useEffect(() => {
    const fetchAllUsers = async () => {
      // console.log(user)
      try {
        const res = await axios.get("http://localhost:5000/api/auth/allUsers", {
          headers: { Authorization: `Bearer ${token}` },
        }
        )
        console.log(res)
        setUsers(res.data.chatUsers)
console.log(users)

      } catch (error) {
        console.log(error)
      }
    }
    fetchAllUsers()
  }
    , [token , user])


  useEffect(() => {
    console.log(person)
    console.log(isOnlineUsers)
    console.log(lastSeenMap)
  }, [])


  const handleUser = (e) => {
    const selectedPerson = e.target.value
    setPerson(e.target.value)
    localStorage.setItem("person", selectedPerson)

  }
  // useEffect(async()=>{
  // try {
  //   const res = await axios.post("http://localhost:5000/api/read")

  // } catch (error) {

  // }
  // },[person])

  const handleExit = () => {
    localStorage.removeItem("person")
    setPerson(null)
  }


  const handleLogout = () => {
    localStorage.removeItem("person")
    setPerson(null)
    logout()

  }
  const handleTyping = (e) => {
    setMsg(e.target.value);
    socket.emit("typing", { sender: user?.username, reciever: person })
    console.log({ sender: user?.username, reciever: person })
    clearTimeout(typingTimeoutRef.current)
    typingTimeoutRef.current = setTimeout(() => {
      socket.emit("Not typing", { sender: user?.username, reciever: person })
    }, 1000)
  }
  const handleStatus = async (e) => {
    const newStatus = e.target.value;
    setStatus(newStatus);

    try {
      const res = await axios.post(
        "http://localhost:5000/api/status",
        { status: newStatus }, // body
        {
          headers: { Authorization: `Bearer ${token}` } // config
        }
      );
      console.log(res.data);
      socket.emit("register", user?.username, newStatus)
    } catch (error) {
      console.log(error);
    }
  };
const handleSearch = async()=>{
  try {
    const res = await axios.get(`http://localhost:5000/api/auth/search/${username}`,
      {
        headers:{Authorization : `Bearer ${token}`}
      }
    )
    console.log(res)
    setSearch(true)
    setSearchedUser(res.data.user)
    console.log(searchedUser)
  } catch (error) {
    console.log(error)
  }
}
const handleSubmit=async (e)=>{
  e.preventDefault();
  try {
    const res = await axios.put("http://localhost:5000/api/auth/update",{
      username:form.username,
      email:form.email

    },  {
        headers : { Authorization : `Bearer ${token}`}
      })
      console.log(res)
      setUser(res.data.updatedUser)
        setShowModal(false);
        setForm({
          email:"",
          username:""
        })
  } catch (error) {
    console.log(error)
  }
}
const openEditModal = () => {
  setShowModal(true);
};

  return (
    <>
      <ChatNavbar onEditClick={openEditModal} onDeleteClick={handleDelete}/>
      <div className="min-h-screen bg-gray-100 p-4 flex h-screen">
        {/* Sidebar */}
         <div className='flex flex-col gap-3'>
<div className='flex gap-2 flex-col'>
  <input type="text" 
   onChange={(e)=> setusername(e.target.value)}
   placeholder='Search Username '
   className='border-3 p-2 rounded-2xl'
   />
   <Button onClick={handleSearch} variant="primary">Search</Button>
   { search && searchedUser.map((user)=>(
    <button  key={user._id}>
      {user?.username} || No users Found
    </button>
   ))}
   {/* Come back here tomorrow and finish this  */}
</div>
        <div className="bg-white border-r w-[20vw] overflow-y-auto">
          <ListGroup variant="flush" className="h-full">
            {users
              .filter((u) => u?.username !== user?.username)
              .map((u) => {
                const lastSeenTime = lastSeenMap[u.username]
                  ? new Date(lastSeenMap[u.username]).toLocaleTimeString()
                  : null;

                return (
                  <ListGroup.Item
                    key={u}
                    action
                    active={person === u}
                    onClick={() => handleUser({ target: { value: u } })}
                    className={`flex justify-between items-center cursor-pointer border-b px-3 py-2 
                hover:bg-gray-100 ${person === u.username
                        ? "bg-blue-100 border-l-4 border-blue-500"
                        : ""
                      }`}
                  >
                    <span className="font-medium">{u}</span>
                    {isOnlineUsers.includes(u) ? (
                      <span className="text-green-500 text-sm">●</span>
                    ) : lastSeenTime ? (
                      <small className="text-gray-500">{lastSeenTime}</small>
                    ) : null}
                  </ListGroup.Item>
                );
              })}
          </ListGroup>
        </div>
        </div>
        


        {/* Chat display */}
        <div className="flex-1 flex flex-col bg-white p-4">
          {person ? (
            <>
              <h2 className="text-xl font-semibold mb-2">Chat with {person}</h2>
              <div className="flex-1 overflow-y-auto border p-2 mb-2">
                {messages.map((m, i) => {
                  const isSender = m.sender === user?.username;

                  return (
                    <div
                      key={i}
                      className={`flex mb-2 ${isSender ? "justify-end" : "justify-start"
                        }`}
                    >
                      <div
                        className={`max-w-xs px-3 py-1 rounded-lg text-sm ${isSender
                          ? "bg-blue-500 text-white rounded-br-none"
                          : "bg-gray-200 text-gray-900 rounded-bl-none"
                          }`}
                      >

                        {m.text}

                        <div className="text-xs mt-0.5 text-gray-600">
                          {isSender ? "You" : m.sender}
                        </div>
                      </div>

                    </div>
                  );
                })}
                {isTyping && <div className="italic">{person} is typing...</div>}
              </div>
              <div className="flex gap-2">
                <input
                  className="flex-1 border px-2 py-1 rounded"
                  value={msg}
                  onChange={handleTyping}
                  placeholder="Type your message..."
                />
                <button
                  className="bg-blue-500 text-white px-4 py-1 rounded"
                  onClick={sendMessage}
                >
                  Send
                </button>
              </div>

              <button className="mt-2 text-red-600" onClick={handleExit}>
                Exit chat
              </button>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-500">
              Select a user to start chatting
            </div>
          )}
        </div>
           <Modal show={showModal} onHide={handleCloseModal} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Edit User</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <form onSubmit={handleSubmit} className="d-flex flex-column gap-3">
                        <input
                            type="text"
                          
                            className="form-control"
                            placeholder="UserName"
                            value={form.username}
                            onChange={(e)=>setForm((prev => ({...prev , username:e.target.value})))}
                        />
                        <input
                            type="text"
                     
                            className="form-control"
                            placeholder="Email"
                            value={form.email}
                            onChange={(e)=>setForm((prev => ({...prev , email:e.target.value})))}
                        />
                      
      <Button variant="primary" type="submit">Done</Button>
                      
                    </form>
                </Modal.Body>
            </Modal>
      </div>
    </>
  )
}

export default Chat
