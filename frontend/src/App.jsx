import React from "react"

import Home from "./pages/Home"

import InsertTimeTable from "./pages/insertTimeTable"
import { Routes , Route } from "react-router-dom"
import InsertSubjects from "./pages/insertSubjects"
import SignUpPage from "./pages/SignUpPage"
import DisplaySubject from "./components/ui/displaySubject"
import MainLayout from "./components/ui/MainLayout"
import ErrorPage from "./pages/ErrorPage"


function App() {
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

  return (
    <>
      <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/signup" element={<SignUpPage />} />
      <Route element={<MainLayout />}>
        <Route path="/insertSubjects" element={<InsertSubjects />} />
        <Route path="/insertTimeTable" element={<InsertTimeTable />} />
        <Route path="/home" element={<DisplaySubject />} />
      </Route>
      <Route path="/error/:id" element={<ErrorPage/>} />
      <Route path="*" element={<ErrorPage/>}></Route>{/* Fallback route for undefined paths */}
    </Routes>
    </>
  );
}


export default App
