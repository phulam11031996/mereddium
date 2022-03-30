import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Box from "@mui/material/Box";
import PostList  from "./Components/Post/post";
import Signin from "./Components/Login/SigninForm";
import Signup from "./Components/Login/SignupForm";

import './index.css';

function MyApp() {
  return (
        <Router>
          <Box sx={{ flexGrow: 1 }} style={{marginLeft: 100, marginTop: 30, marginRight: 50, marginBottom: 30}}>
            <Routes>
              <Route exact path="/" element={<PostList />} />
              <Route exact path="/login" element={<Signin />} />
              <Route exact path="/signup" element={<Signup />} />
            </Routes>
          </Box>
        </Router>
  );
}

ReactDOM.render(<MyApp />, document.getElementById('root'));
