
import { createBrowserRouter, createRoutesFromElements, Route } from "react-router-dom";
import Login from './pages/Login';
import Home from './pages/Home';
import Chat from "./pages/Chat";


export const router = createBrowserRouter(
  createRoutesFromElements(
    <>

    <Route path="/login" element={<Login/>}/>
    <Route path="/" element={<Home/>}/>
    <Route path="/chat" element={<Chat/>}/>
    </>
  )
)
 // chats between two users has been renderd now make ui beeter and userschme ans securities and revise this .