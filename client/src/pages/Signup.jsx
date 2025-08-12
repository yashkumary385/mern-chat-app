import React, { useState ,  } from 'react'
import { useNavigate } from 'react-router-dom';
import { Lock ,Mail } from "lucide-react";
import axios from "axios"
import Button from 'react-bootstrap/Button';


export const Signup = () => {
  const navigate = useNavigate();
   const [form , setForm] = useState({
    username:"",
    email:"",
    password:""
   })


   const handleChange = (e)=>{
    setForm((prev)=> ({...prev ,[e.target.name]:e.target.value}))
   }
   const handleSignup =async (e)=>{
    e.preventDefault();
    try {
      const res= await axios.post("http://localhost:5000/api/auth/register",{
        username:form.username,
        password:form.password,
        email:form.email
      })
      console.log(res)
      navigate("/")
    } catch (error) {
      console.log(error)
    }
   }
 return (
    <div
      className="flex justify-center items-center min-h-[100vh]  bg-black

"
     >
      <div className="w-[350px] p-6 rounded-lg shadow-md bg-[#F9FAFB] flex flex-col items-center gap-6">
        <div className="text-2xl font-bold">Signup</div>

        {/* Icon Centered */}
        <div className="flex justify-center items-center">
          <Lock className="w-6 h-6 text-gray-600" />
        </div>

        {/* Form Centered */}
        <form
          className="flex flex-col gap-3 w-full"
          onSubmit={handleSignup}
        >
          {/* Email */}
          <div className="relative w-full">
            <Mail className="absolute top-2 left-2 w-6 h-6 text-gray-600" />
            <input
              type="text"
              name="username"
              className="border-2 border-blue-200 pl-12 pr-10 py-2 w-full rounded hover:bg-gray-100"
              value={form.username}
              placeholder="Username"
              onChange={(e)=>handleChange(e)}
              required
            />
          </div>
          <div className="relative w-full">
            <Mail className="absolute top-2 left-2 w-6 h-6 text-gray-600" />
            <input
              type="email"
              name="email"
              className="border-2 border-blue-200  pl-12 pr-10 py-2 w-full rounded hover:bg-gray-100"
              value={form.email}
              placeholder="Email"
              onChange={(e)=>handleChange(e)}
              required
            />
          </div>

          {/* Password */}
          <div className="relative w-full">
            <Lock className="absolute top-2 left-2 w-6 h-6 text-gray-600" />
            <input
            name="password"
              type="password"
              className="border-2 border-blue-200 pl-12 pr-10 py-2 w-full rounded hover:bg-gray-100"
              value={form.password}
              placeholder="Enter password"
              onChange={(e)=>handleChange(e)}
              required
            />
          </div>

          {/* Button styled as "outline-success" */}
          <Button
          variant='primary'
            type="submit"
            className="w-full py-2 border-2 border-blue-200 text-blue-400 rounded hover:bg-green-50 transition duration-150"
          >
            Signup
          </Button>
        </form>
      </div>
    </div>
  );
}
  
export default Signup
