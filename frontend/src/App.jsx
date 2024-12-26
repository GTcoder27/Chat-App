import {React, useEffect } from 'react';
import Navbar from "./components/Navbar.jsx";
import { Routes,Route, Navigate } from 'react-router-dom';
import SignupPage from "./pages/SignupPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import HomePage from "./pages/HomePage.jsx";
import SettingsPage from "./pages/SettingsPage.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";
import {useAuthStore}  from "./store/useAuthStore.js";
import { useThemeStore } from "./store/useThemeStore";
import {Loader} from "lucide-react";
import {Toaster} from "react-hot-toast";


const App = () => {

  const { authUser, checkAuth, isCheckingAuth} = useAuthStore();
  const { theme } = useThemeStore();
  // console.log({ onlineUsers });

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  console.log({ authUser });

  if (isCheckingAuth && !authUser)
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="size-10 animate-spin" />
      </div>
    );



  return (
    <div data-theme={theme} className=' flex flex-col w-[100vw] h-auto text-center justify-center items-center' >

      {/* <div data-theme={theme}> */}
      <Navbar />

      <Routes>
        <Route path="/" element={authUser ? <HomePage /> : <Navigate to="/login" />} />
        <Route path="/signup" element={!authUser ? <SignupPage /> : <Navigate to="/" />} />
        <Route path="/login" element={!authUser ? <LoginPage /> : <Navigate to="/" />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/profile" element={authUser ? <ProfilePage /> : <Navigate to="/login" />} />
      </Routes>

      <Toaster />
    </div>
  )
}

export default App;