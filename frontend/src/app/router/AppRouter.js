import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { LogIn, SignUp, Posts } from "../pages";

export const AppRouter = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Posts />} />
        <Route path="/login" element={<LogIn />} />
        <Route path="/signup" element={<SignUp />} />
      </Routes>
    </Router>
  );
};
