import { createRoot } from 'react-dom/client'
import './index.css'
import { router } from './App.jsx'
import { UserProvider } from './context/UserProvider.jsx'
import { RouterProvider } from 'react-router-dom'
import { ToastContainer, Bounce } from "react-toastify";
createRoot(document.getElementById('root')).render(

  // <StrictMode>
  // this gives all the data about the user to all the eleemsnts is is a wrapper
  <UserProvider>
    <ToastContainer
      position="top-right"
      autoClose={5000}
      hideProgressBar={false}
      newestOnTop
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme="dark"
      transition={Bounce}
    />
    <RouterProvider router={router} />
  </UserProvider>
  // </StrictMode>,
)
