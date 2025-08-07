import React, { useState ,  } from 'react'
import { useNavigate } from 'react-router-dom';
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
        navigate("/")
      }


    } catch (error) {
        console.log("error")
    }
  }
  return (
    <div>
      <form>
        <input type="email" 
        value={email}
        onChange={(e)=> setEmail(e.target.value)}
        placeholder='Enter Email'
        className='bg-amber-200'
        />
        <input type="password" 
        value={password}
        onChange={(e)=> setPassword(e.target.value)}
        placeholder='Enter password'
        className='bg-red-200'
        />
        <button onClick={handleLogin}>Login</button>
      </form>
    </div>
  )
}

export default Login
