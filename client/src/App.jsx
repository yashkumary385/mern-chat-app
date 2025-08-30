
import { createBrowserRouter, createRoutesFromElements, Route } from "react-router-dom";
import Login from './pages/Login';
import Chat from "./pages/Chat";
import Signup from "./pages/Signup";
import PrivateRoutes from "../utils/PrivateRoutes";


export const router = createBrowserRouter(
  createRoutesFromElements(
    <>
    <Route path="/" element={<Login/>}/>
    <Route path="/signup" element={<Signup/>}/>
    <Route path="/chat" element={
   <PrivateRoutes>
      <Chat/>
    </PrivateRoutes>
      
      }/>
         <Route path="*" element={<Login/>}/>
      
    </>
    
  )
)
 // chats between two users has been renderd now make ui beeter and userschme ans securities and revise this .