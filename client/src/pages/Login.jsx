import React, { useState ,  } from 'react'
import { useNavigate } from 'react-router-dom';
import { Lock ,Mail } from "lucide-react";
import { useUser } from '../hooks/useUser';


export const Login = () => {
  const navigate = useNavigate();
    const {login} = useUser();
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const handleLogin =async (e)=>{
    e.preventDefault();
    try {
      const result =  await login(email ,password)
      console.log(result)
      if(result.success){
        navigate("/chat")
      }


    } catch (error) {
        console.log("error")
    }
  }
 return (
    <div
      className="flex justify-center items-center min-h-[100vh]  

"
 style={{
    background: 'linear-gradient(to right, #1f1c2c, #928dab)',
  }}    >
      <div className="w-[350px] p-6 rounded-lg shadow-md bg-[#F9FAFB] flex flex-col items-center gap-6">
        <div className="text-2xl font-bold">Login</div>

        {/* Icon Centered */}
        <div className="flex justify-center items-center">
          <Lock className="w-6 h-6 text-gray-600" />
        </div>

        {/* Form Centered */}
        <form
          className="flex flex-col gap-3 w-full"
          onSubmit={handleLogin}
        >
          {/* Email */}
          <div className="relative w-full">
            <Mail className="absolute top-2 left-2 w-6 h-6 text-gray-600" />
            <input
              type="email"
              className="border-2 border-[#4CAF50] pl-12 pr-10 py-2 w-full rounded hover:bg-gray-100"
              value={email}
              placeholder="Email"
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* Password */}
          <div className="relative w-full">
            <Lock className="absolute top-2 left-2 w-6 h-6 text-gray-600" />
            <input
              type="password"
              className="border-2 border-[#4CAF50] pl-12 pr-10 py-2 w-full rounded hover:bg-gray-100"
              value={password}
              placeholder="Enter password"
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {/* Button styled as "outline-success" */}
          <button
            type="submit"
            className="w-full py-2 border-2 border-green-600 text-green-600 rounded hover:bg-green-50 transition duration-150"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
  
export default Login
