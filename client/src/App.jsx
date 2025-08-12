
import { createBrowserRouter, createRoutesFromElements, Route } from "react-router-dom";
import Login from './pages/Login';
import Chat from "./pages/Chat";
import Signup from "./pages/signup";


export const router = createBrowserRouter(
  createRoutesFromElements(
    <>
    <Route path="/" element={<Login/>}/>
    <Route path="/signup" element={<Signup/>}/>
    <Route path="/chat" element={<Chat/>}/>
    </>
  )
)
 // chats between two users has been renderd now make ui beeter and userschme ans securities and revise this .