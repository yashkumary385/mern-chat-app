import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from 'react-bootstrap/Button';
import axios from "axios"
import { User, Eye, Mail, Lock, ClipboardPenLine } from "lucide-react";
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast, Bounce } from 'react-toastify';


export const Signup = () => {
  const [form , setForm] = useState({
    username:"",
    password:"",
    email:""
  })
  
 const handleSignup = ()=>{
    
 }


    
}

  return (
    <div
      className="flex justify-center items-center min-h-[100vh]"
      style={{
        background: 'linear-gradient(to right, #1f1c2c, #928dab)',
      }}
    >
      <div className="w-[350px] p-6 rounded-lg shadow-md bg-[#1e1e1e] flex flex-col items-center gap-6 text-white">
        <div className="text-2xl font-bold">Sign Up</div>

        {/* Icon */}
        <div className="flex justify-center items-center">
          <User className="w-6 h-6 text-gray-300" />
        </div>

        {/* Form */}
        <form className="flex flex-col gap-3 w-full" onSubmit={handleSignup}>
          {/* Name */}
          <div className="relative w-full">
            <User className="absolute top-2 left-2 w-6 h-6 text-gray-400" />
            <input
              type="text"
              className="bg-[#2a2a2a] border border-gray-600 pl-12 pr-10 py-2 w-full rounded text-white placeholder-gray-400"
              placeholder="Full Name"
              value={form.name}
              onChange={(e) => setForm((prev)=> ({...prev , name:e.target.value}))}
              required
            />
          </div>

          {/* Email */}
          <div className="relative w-full">
            <Mail className="absolute top-2 left-2 w-6 h-6 text-gray-400" />
            <input
              type="email"
              className="bg-[#2a2a2a] border border-gray-600 pl-12 pr-10 py-2 w-full rounded text-white placeholder-gray-400"
              placeholder="Email"
              value={email}
              onChange={(e) => setForm((prev)=> ({...prev , email:e.target.value}))}
              required
            />
          </div>

          {/* Password */}
          <div className="relative w-full">
            <Lock className="absolute top-2 left-2 w-6 h-6 text-gray-400" />
            <input
              type="password"
              className="bg-[#2a2a2a] border border-gray-600 pl-12 pr-10 py-2 w-full rounded text-white placeholder-gray-400"
              placeholder="Password"
              value={password}
              onChange={(e) => setForm((prev)=> ({...prev , password:e.target.value}))}
              required
            />
          </div>

          {/* Signup Button */}
          <button
            type="submit"
            className="w-full py-2 border border-green-500 text-green-400 rounded hover:bg-green-600 hover:text-white transition"
          >
            Sign Up
          </button>
        </form>
      </div>
    </div>
  );