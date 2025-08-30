import { io } from 'socket.io-client'
import { useEffect, useState } from 'react'
import { useUser } from '../hooks/useUser';
import ListGroup from 'react-bootstrap/ListGroup';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { toast } from 'react-toastify';

import { useRef } from 'react';
import ChatNavbar from '../components/Navbar';
import { useNavigate } from 'react-router-dom';
import { fetchMessagesApi, deleteAccountApi, fetchAllUsersApi, searchUsersApi, updateProfileApi, deleteChatApi, updateMessageApi ,saveMessageApi,deleteMessageApi} from '../api/api';
const socket = io(import.meta.env.VITE_SOCKET_URL) // this tells us about our backend from where the request comes

const Chat = () => {
  const { user, token, logout, setUser } = useUser();
  const [isTyping, setIsTyping] = useState(false)
  const [showModal, setShowModal] = useState(false);
  const typingTimeoutRef = useRef(null)
  const [users, setUsers] = useState([])
  const [msg, setMsg] = useState("");
  const [messages, setMessages] = useState([]);
  const [person, setPerson] = useState(() => localStorage.getItem("person") || null)
  const [isOnlineUsers, SetIsOnlineUsers] = useState([])
  const [lastSeenMap, setLastSeenMap] = useState({})
  const [username, setusername] = useState("")
  const [searchedUser, setSearchedUser] = useState([])
  const navigate = useNavigate()
  const [editingMsgId, setEditingMsgId] = useState(null);
  const [editText, setEditText] = useState("");
  const [search, setSearch] = useState(false);
  const [form, setForm] = useState({
    email: "",
    name: "",
    status: ""
  })
  useEffect(() => {
    if (!user?.username) return;
    console.log(user)
    socket.emit("register", user?.username, user?.status) // emits an event register whne the user gets loaded in to the memory 
  }, [user]) // context didnt load if depdndecy emptty hence no user then nothing send hence crash occurs 

  useEffect(() => {
    setForm({
      email: user?.email || "",
      name: user?.name || "",
      status: user?.status || ""
    })
  }, [user])
  const sendMessage = async() => {
    const newMsg = {
      sender: user?.username,
      text: msg,
      reciever: person
    };


  try {
    // Save to backend first so it gets id nad then add it to the set messages so it is in set messages and then u can fetch the id 
    // const res = await axios.post("http://localhost:5000/api/messages", newMsg, {
    //   headers: { Authorization: `Bearer ${token}` }
    // });
    const res = await saveMessageApi(newMsg);
    const savedMsg = res.data.message; // Make sure your backend returns the saved message with _id

    socket.emit("chat-message", savedMsg); // Emit the saved message with _id
    setMessages((prev) => [...prev, savedMsg]); // Add to state with _id
    setMsg("");
  } catch (error) {
    toast.error( error.data?.message ||"Failed to send message");
  }
    // setMessages((prev) => [...prev, newMsg]); // this is creating problem rendering two messages
    
  };

  //   const sendMessage = () => {
  //     console.log(user)
  //     socket.emit("chat-message",
  //       {
  //         sender: user?.username,
  //         text: msg,
  //         reciever: person
  //       })
  //   // setMessages((prev) => [...prev, newMsg]); 
  // // 
  //     setMsg("")  // we take from the frontend user or client 
  //   }

  const fetchMessages = async () => {
    try {
      // const res = await axios(`http://localhost:5000/api/messages/${user?.username}/${person}`);
      const res = await fetchMessagesApi(user?.username, person);
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
  }, [person, user]) // either one changes runs the effect
   // only when depedndecy changes and doesnt run on every render 
  // because user might not be available so it waits for the user to be available and then  caals function
  // pu useeffct
  useEffect(() => { // a msg coming from the server and event chat-message 
    socket.on('chat-message', (incomingMsg) => {
      console.log(incomingMsg)
      // setMessages((prev) => [...prev, incomingMsg]);
    },[]);

    socket.on("typing", ({reciever }) => { // we fisrt send the emit through socket emit and then get with on in baceknd an then cacth with on in frontned 
      console.log("typing hitt")
      if (reciever === user?.username) {
        setIsTyping(true)
      }
    })
    socket.on("not-typing", ({  reciever }) => {
      if (reciever === user?.username) {
        setIsTyping(false)
      }
    })
    return () => {
      socket.off('chat-message');
      socket.off("typing")
      socket.off("not-typing")

    };
  }, [user?.username]);


  useEffect(() => {
    socket.on("online-users", (users) => {
      SetIsOnlineUsers(users)
    })
    socket.on("user-offline", (username) => { // remove the user from the isonline array
      SetIsOnlineUsers((prev) => prev.filter((u) => u !== username))
    })
    console.log(messages)
  
    return () => {
      socket.off("online-users")
      socket.off("user-offline")
    }
  }, [])

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleDelete = async () => {
    const confirm = window.confirm("Are you sure you want to delete profile you wont be able to revocer it ?")
    if (!confirm) return;
    try {
      // const res = await axios.delete("http://localhost:5000/api/auth/delete", {
      //   headers: { Authorization: `Bearer ${token}` }
      // })
      const res = await deleteAccountApi();
      logout()
      navigate("/")
      //
      console.log(res)
      setPerson("")
      toast.success("Profile Deleted")

    } catch (error) {
      console.log(error)
      if (error.response?.message) {
        toast.error(error.response?.message)
      } else {
        toast.error("Something went wrong")
      }
    }
  }
  //  const handleRead =async ()=>{
  // try {
  //   const res= await axios.put(`http://localhost:5000/api/read/${user?.username}/${person}`,{},
  //     {
  //       headers : {Authorization : `Bearer ${token}`}
  //     }
  //   )
  //   setMessages((prevMessages)=> 
  //   prevMessages.map((msg)=>(
  //     msg.sender === person ?{...msg , read:true } : msg
  //   ))
  // )
  // // console.log(res)
  // } catch (error) {
  //   console.log(error)
  // }
  //  }
  // useEffect(() => {
  //   if (person) {
  //     handleRead();
  //   }
  // }, [person]);
  useEffect(() => {

    socket.on("last-seen-online", (lastSeen) => {
      setLastSeenMap(lastSeen) //last seen is an objct coming from backend
    })
    return () => {

      socket.off("last-seen-online");
    }
  }, [])

  const fetchAllUsers = async () => {
    // console.log(user)
    try {
      // const res = await axios.get("http://localhost:5000/api/auth/allChatUsers", {
      //   headers: { Authorization: `Bearer ${token}` },
      // }
      // )
      const res = await fetchAllUsersApi();
      // console.log(res)
      setUsers(res.data.chatUsers)
      console.log(users)

    } catch (error) {
      console.log(error)
    }
  }
  useEffect(() => {

    fetchAllUsers()
  }
    , [token, user])

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
    const confirm = window.confirm("Are You Sure You Want To Logout ?");
    if (!confirm) return;
    localStorage.removeItem("person")
    setPerson(null)
    navigate("/")
    toast.success("Logout Done")
    logout()
  }
  const handleTyping = (e) => {
    setMsg(e.target.value);
    socket.emit("typing", { sender: user?.username, reciever: person })
    // console.log({ sender: user?.username, reciever: person })
    clearTimeout(typingTimeoutRef.current)
    typingTimeoutRef.current = setTimeout(() => {
      socket.emit("not-typing", { sender: user?.username, reciever: person })
    }, 1000)
  }
  // const handleStatus = async (e) => {
  //   const newStatus = e.target.value;
  //   setStatus(newStatus);

  //   try {
  //     const res = await axios.post(
  //       "http://localhost:5000/api/status",
  //       { status: newStatus }, // body
  //       {
  //         headers: { Authorization: `Bearer ${token}` } // config
  //       }
  //     );
  //     console.log(res.data);
  //     socket.emit("register", user?.username, newStatus)
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  const handleSearch = async () => {
    try {
      // const res = await axios.get(`http://localhost:5000/api/auth/search/${username}`,
      //   {
      //     headers: { Authorization: `Bearer ${token}` }
      //   }
      // )
      const res = await searchUsersApi(username);
      console.log(res)
      setSearchedUser(res.data.user)

      setSearch(true)

      console.log(searchedUser)
    } catch (error) {
      toast.error(error.response?.data.message)
      console.log(error)
    }
  }
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // const res = await axios.put("http://localhost:5000/api/auth/update", {
      //   name: form.name,
      //   email: form.email,
      //   status: form.status
      // }, {
      //   headers: { Authorization: `Bearer ${token}` }
      // })
      const res = await updateProfileApi({

        name: form.name,
        email: form.email,
        status: form.status
      });
      console.log(res)
      console.log(form)
      setUser(res.data.updatedUser)
      setShowModal(false);
      // setForm({
      //   email:"",
      //   username:"",
      //   status:""
      // })
      toast.success("User Details Updated SuccesFully")
    } catch (error) {
      console.log(error)
      if (error.response?.message) {
        toast.error(error.response?.message)
      } else {
        toast.error("Something went wrong")
      }
    }
  }
  const openEditModal = () => {
    setShowModal(true);
  };
  const handlePerson = (e) => {
    const newPerson = e.target.value
    setPerson(e.target.value)
    localStorage.setItem("person", newPerson)
    fetchMessages();
    // fetchAllUsers()
  }
  const handleChat = async () => {
    const confirmDelete = window.confirm("Are you sure you want to delete this chat?");
    if (!confirmDelete) return;
    try {
      // await axios.delete(
      //   `http://localhost:5000/api/deleteChat/${user.username}/${person}`,
      //   {
      //     headers: { Authorization: `Bearer ${token}` }
      //   }
      // );
      await deleteChatApi(user.username, person);
      // After successful deletion, clear messages from UI

      setMessages([]); // Clear UI
      alert("Chat deleted successfully");
    } catch (error) {
      console.log(error);
      alert("Failed to delete chat");
    }
  };

  const handleDeleteMsg = async (msgId) => {
    const confirm = window.confirm("Delete this message?");
    if (!confirm) return;
    try {
      // await axios.delete(`http://localhost:5000/api/messages/${msgId}`, {
      //   headers: { Authorization: `Bearer ${token}` }
      // });
       await deleteMessageApi(msgId, "This message was deleted");
      setMessages((prev) => prev.filter((m) => m._id !== msgId));
    } catch (error) {
      toast.error( error.data?.message||"Failed to delete message");
    }
  };

  const handleEditMsg = (msgId, text) => {
    console.log(msgId, text)
    setEditText(text)
    setEditingMsgId(msgId)
  }


  const handleEditSubmit = async (msgId) => {
    try {
      // const res = await axios.put(
      //   `http://localhost:5000/api/messages/${msgId}`,
      //   { text: editText },
      //   { headers: { Authorization: `Bearer ${token}` } }
      // );

      const res=await updateMessageApi(msgId, {text :editText});
      console.log(res)
      setMessages((prev) =>
        prev.map((m) => (m._id === msgId ? { ...m, text: editText } : m))
      ); //edit the text then and there 
      setEditingMsgId(null);
      setEditText("");
    } catch (error) {
      toast.error(error.data?.message ||"Failed to update message" );
    }
  };
  return (
    <>
      <ChatNavbar onEditClick={openEditModal} onDeleteClick={handleDelete} onLogout={handleLogout} />
      <div className="min-h-screen bg-gray-100 p-4 flex h-screen">
        {/* Sidebar */}
        <div className='flex flex-col gap-3'>
          <div className='flex gap-2 flex-col'>
            <input type="text"
              onChange={(e) => setusername(e.target.value)}
              placeholder='Search Username '
              className='border-1 hover:bg-blue-100 p-2 mr-2 rounded-2xl'
            />
            <Button onClick={handleSearch} variant="primary">Search</Button>

            {search && searchedUser.length == 0 ? (<div>No users with this username</div>) : search && searchedUser.length > 0 ? (

              <div>
                <div className="mb-2 font-semibold">Here are your users:</div>
                {searchedUser.map((user) => (

                  <div
                    key={user._id}
                    onClick={() => handlePerson({ target: { value: user.username } })}
                    className="cursor-pointer border px-3 py-2 rounded-lg hover:bg-blue-100 dark:hover:bg-gray-700"
                  >
                    {user.username}
                  </div>
                )
                )}</div>
            ) : null}


            {/* Come back here tomorrow and finish this  */}
          </div>
          <div className="bg-white border-r w-[20vw] overflow-y-auto">
            <ListGroup variant="flush" className="h-full">
              {(users || [])
                .filter((u) => u !== user?.username)
                .map((u) => {
                  const lastSeenTime = lastSeenMap[u]
                    ? new Date(lastSeenMap[u]).toLocaleTimeString()
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
                        <small className="text-gray-500">  Last seen at  {lastSeenTime} </small>
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
                <div className='flex items-center justify-center opacity-50 mt-3'>
                  {messages.length === 0 && <div>No messages yet. Start the conversation! 💬</div>
                  }
                </div>
                {messages.map((m, i) => {
                  const isSender = m.sender === user?.username;

                  return (
                    <div
                      key={m._id || i}
                      className={`flex mb-2 ${isSender ? "justify-end" : "justify-start"
                        }`}
                    >
                      <div
                        // onClick={() => setShowButton(!showButton)}
                        className={`max-w-xs px-3 py-1 rounded-lg text-sm ${isSender
                          ? "bg-blue-500 text-white rounded-br-none"
                          : "bg-gray-200 text-gray-900 rounded-bl-none"
                          }`}
                      >
                        {editingMsgId === m._id ? (
                          <div>
                            <input
                              value={editText}
                              onChange={(e) => setEditText(e.target.value)}
                              className="border px-2 py-1 rounded text-black"
                            />
                            <button
                              className="ml-2 text-xs text-white underline"
                              onClick={() => handleEditSubmit(m._id)}
                            >
                              Save
                            </button>
                            <button
                              className="ml-2 text-xs text-gray-600 underline"
                              onClick={() => setEditingMsgId(null)}
                            >
                              Cancel
                            </button>


                          </div>




                        ) : (

                          <>




                            {m.text}
                            <div className="text-xs mt-0.5 text-gray-600">
                              {isSender ? "You" : m.sender}
                            </div>
                            {isSender && (
                              <div className='flex flex-row gap-2'>
                                <button
                                  className="text-xs text-blue-600 underline"
                                  onClick={() => handleEditMsg(m._id, m.text)}
                                >
                                  Edit
                                </button>
                                <button
                                  className="text-xs text-red-600 underline"
                                  onClick={() => handleDeleteMsg(m._id)}
                                >
                                  Delete
                                </button>
                              </div>
                            )}

                          </>
                        )}
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

              <button className="mt-2 text-blue-600" onClick={handleExit}>
                Exit chat
              </button>
              <button className="mt-2 text-red-600" onClick={handleChat}>
                Delete chat
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
                className='p-2 border-2 bg-gray-100'
                placeholder="Username"
                value={user?.username}
                readOnly
              />
              <small className="text-muted mb-2">
                Your username is required. Friends can only search you by your username.
              </small>
              <input
                type="text"
                className='p-2 border-2'
                placeholder="Name"
                value={form.name}
                onChange={(e) => setForm((prev => ({ ...prev, name: e.target.value })))}
              />
              <input
                type="email"
                className='p-2 border-2'
                placeholder="Email"
                value={form.email}
                onChange={(e) => setForm((prev => ({ ...prev, email: e.target.value })))}
              />
              <div>{user?.status} is your current Status</div>
              <select value={form.status} onChange={(e) => setForm((prev) => ({ ...prev, status: e.target.value }))}>
                <option value="">Select Status</option>
                <option value="invisible">Invisible (No Info About Last Seen or Online)</option>
                <option value="online">Visible (Will Be Shown Online When You Are)</option>
              </select>

              <Button variant="primary" type="submit">Done</Button>

            </form>
          </Modal.Body>
        </Modal>
      </div>
    </>
  )
}

export default Chat
