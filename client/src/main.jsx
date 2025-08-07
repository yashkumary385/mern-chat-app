import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { router} from './App.jsx'
import { UserProvider } from './context/UserProvider.jsx'
import {  RouterProvider } from 'react-router-dom'

createRoot(document.getElementById('root')).render(

  // <StrictMode>
  // this gives all the data about the user to all the eleemsnts is is a wrapper
    <UserProvider> 
  <RouterProvider router={router}/>
    </UserProvider>
  // </StrictMode>,
)
