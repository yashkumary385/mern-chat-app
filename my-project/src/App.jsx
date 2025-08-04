import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import { io } from 'socket.io-client'
import './App.css'

const socket = io("http://localhost:3000") // this tells us about our backend from where the request comes
function App() {
  const [msg , setMsg] = useState("");
  // socket.on("message")
  const sendMessage = ()=>{
    console.log("yess")
    socket.emit("chat-message(outgoing from frontend)" , msg )
  }


  return (
 <div>
  <input className='bg-yellow-400' type="text"  value={msg} onChange={(e)=> setMsg(e.target.value)}/>
  <button className='bg-red-500' onClick={sendMessage}>send</button>
 </div>
  )
}

export default App
