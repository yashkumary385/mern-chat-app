import React, { useState ,  } from 'react'
import { useNavigate } from 'react-router-dom';
import { Lock ,Mail ,User, User2} from "lucide-react";
import axios from "axios"
import Button from 'react-bootstrap/Button';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import { signupApi } from '../api/api';


export const Signup = () => {
  const [ recommendations, setRecommendations ] = useState([]);
  const navigate = useNavigate();
   const [form , setForm] = useState({
    username:"",
    email:"",
    password:"",
    name1:""
   })

const validateEmail = (email) => {
    // Regular expression for a basic email validation
    // It checks for:
    // ^[\w.-]+ : Starts with one or more word characters, dots, or hyphens
    // @ : Followed by an '@' symbol
    // [\w.-]+ : Then one or more word characters, dots, or hyphens (for the domain name)
    // \. : Followed by a dot
    // [A-Za-z]{2,}$: Ends with 2 or more letters (for the top-level domain)
    const re = /^[\w.-]+@[\w.-]+\.[A-Za-z]{2,}$/;
    return re.test(String(email).toLowerCase());
};

const validatePassword = (password) => {
    // Regular expression for password validation
    // It checks for:
    // (?=.*[a-z]) : At least one lowercase letter
    // (?=.*[A-Z]) : At least one uppercase letter
    // (?=.*\d) : At least one digit
    // (?=.*[@$!%*?&]) : At least one special character from the set @$!%*?&
    // [A-Za-z\d@$!%*?&]{8,} : Minimum of 8 characters, consisting of letters, digits, and the allowed special characters
    const re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return re.test(password);
};
   const handleChange = (e)=>{
    setForm((prev)=> ({...prev ,[e.target.name]:e.target.value}))
   }

 


   const handleSignup =async (e)=>{
    e.preventDefault();

    //  if(form.username.length < 3) {
    //         toast.warning("Username must be at least 3 characters long!");
    //         return;
    //     }
    //     if(form.name1.length < 3) {
    //         toast.warning("Name must be at least 3 characters long!");
    //         return;
    //     }

    
    //     if (!validateEmail(form.email)) {
    //         toast.warning("Please enter a valid email address!");
    //         return;
    //     }

    //     if (!validatePassword(form.password)) {
    //         toast.warning("Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character.");
    //         return;
    //     }
    try {
      
    const res = await signupApi(form.username , form.password , form.email , form.name1)  
      console.log(res)
    
      toast.success("Signup SuccessFull")
      navigate("/")
  //  console.log(recommendations)

    } catch (error) {
      console.log(error)
        if(error.response.data.recommendations){
        setRecommendations(error.response.data.recommendations);
      }
      toast.error(error.response?.data.message)
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
            <User className="absolute top-2 left-2 w-6 h-6 text-gray-600" />
            <input
              type="text"
              name="username"
              className="border-2 border-blue-200 pl-12 pr-10 py-2 w-full rounded hover:bg-gray-100"
              value={form.username}
              placeholder="Username"
              onChange={(e)=>handleChange(e)}
              required
            />
           { recommendations.length > 0 && (
            recommendations.map((rec, index) => (
              <div key={index} className="text-sm text-gray-500 mt-1" onClick={()=> setForm((prev)=> ({...prev , username:rec}))} style={{cursor:"pointer"}}>
                Suggestion {index + 1}: {rec}
              </div>
            ))
           )}
          </div>
          <div className="relative w-full">
            <User2 className="absolute top-2 left-2 w-6 h-6 text-gray-600" />
            <input
              type="text"
              name="name1"
              className="border-2 border-blue-200 pl-12 pr-10 py-2 w-full rounded hover:bg-gray-100"
              value={form.name1}
              placeholder="Name"
              onChange={(e)=>handleChange(e)}
             
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
       <div className="mt-4 text-center">
            Already have an account? <Link to="/" className="text-blue-500 font-bold">Login</Link>
          </div>
      </div>
    </div>
  );
}
  
export default Signup
