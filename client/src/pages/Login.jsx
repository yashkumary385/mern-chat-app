import React, { useState ,  } from 'react'
import { useNavigate } from 'react-router-dom';
import { Lock ,Mail } from "lucide-react";
import { useUser } from '../hooks/useUser';
import Button from 'react-bootstrap/Button';
import { Link } from 'react-router-dom';
import Modal from 'react-bootstrap/Modal';
import axios from 'axios';

import { toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
export const Login = () => {
  const navigate = useNavigate();
    const {login} = useUser();
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showModal, setShowModal] = useState(false);

  const handleLogin =async (e)=>{
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please fill in all fields");
      return;
    }
    //   if (password.length < 8) {    
    //   toast.error("Password must be at least 8 characters long");
    //   return;
    // }
    if(!email.includes("@")){
      toast.error("Please enter a valid email address");
      return;
    }

    try {
      const result =  await login(email ,password)
      console.log(result)
      if(result.success){
        navigate("/chat")
      }
    } catch (error) {
        console.log(error)
    }
  }
   const [passwordForm, setPasswordForm] = useState({
    email: "",
    password: "",
    password1: ""
  })
    const handleModal = () => {
    setShowModal(true)
  }
  
  const handleCloseModal = () => {
    setShowModal(false);
  };

   const handlePasswordForm =async (e) => {
    e.preventDefault()
    try {
         const res = await axios.post("http://localhost:5000/api/auth/changePassword",{
      email: passwordForm.email,
      password: passwordForm.password,
      password1: passwordForm.password1
    })
         console.log(res)
         setShowModal(false)
         toast.success(res.data.message)
         setPasswordForm({ email: "",
    password: "",
    password1: ""})
    } catch (error) {
     console.log(error)
     toast.error(error.data)
    }
  }
 return (
  <>
    <div
      className="flex justify-center items-center min-h-[100vh] bg-black  

"
    >
      <div className="w-[350px] p-6 rounded-lg shadow-md bg-[#F9FAFB] flex flex-col items-center gap-6" >
        <div className="text-2xl font-bold">Login</div>

        {/* Icon Centered */}
        <div className="flex justify-center items-center" >
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
              className="border-2 border-blue-200  pl-12 pr-10 py-2 w-full rounded hover:bg-gray-100"
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
              className="border-2 border-blue-200 pl-12 pr-10 py-2 w-full rounded hover:bg-gray-100"
              value={password}
              placeholder="Enter password"
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {/* Button styled as "outline-success" */}
          <Button
          variant='primary'
            type="submit"
            className="w-full py-2 border-2 border-green-600 text-green-600 rounded hover:bg-green-50 transition duration-150"
          >
            Login
          </Button>
        </form>
          <div className="mt-4 text-center">
          Forgot Passord ? <Link onClick={handleModal} variant="success" className="text-blue-500 font-bold">Reset Password</Link>
        </div>
       <div className="mt-4 text-center">
                 Don't have an account? <Link to="/signup" className="text-blue-500 font-bold">Sign Up</Link>
               </div>
      </div>
    </div>
      <Modal show={showModal} onHide={handleCloseModal} centered className="p-2">
        <Modal.Header closeButton>
          <Modal.Title>Reset Password Password</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={handlePasswordForm} className="flex flex-col gap-3 p-2">
            <input type="email"
              placeholder="Enter Your Email"
              value={passwordForm.email}
              onChange={(e) => setPasswordForm((prev) => ({ ...prev, email: e.target.value }))}
              className="border-2 border-gray-300 p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <input type="password"
              placeholder="Enter New Password"
              onChange={(e) => setPasswordForm((prev) => ({ ...prev, password: e.target.value }))}
              value={passwordForm.password}
              className="border-2 border-gray-300 p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
            /> <input type="password"
              placeholder="Confirm Password"
              onChange={(e) => setPasswordForm((prev) => ({ ...prev, password1: e.target.value }))}
              value={passwordForm.password1}
              className="border-2 border-gray-300 p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <div className="flex justify-end gap-2 mt-3">
              <Button variant="secondary" onClick={handleCloseModal}>Cancel</Button>
              <Button variant="primary" type="submit">Update</Button>
            </div>
          </form>
        </Modal.Body>
      </Modal>

    </>
  );
}
  
export default Login
