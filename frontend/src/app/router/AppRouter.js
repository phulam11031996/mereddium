import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PostList from '../pages/Post/post';
import { LogIn } from '../pages/Login';
import { SignUp } from '../pages/SignUp';

export const AppRouter = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<PostList />} />
                <Route path="/login" element={<LogIn />} />
                <Route path="/signup" element={<SignUp />} />
            </Routes>
        </Router>
    );
};
