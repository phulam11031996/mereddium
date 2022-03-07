import  React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

import SideBar from './Components/Sidebar/sidebar';
import AppBar from './Components/AppBar/Appbar';
import ContentBox from './Components/ContentBox';

function MyApp() {

  const [state, setState] = useState({
		posts: []
	})
	
	useEffect(() => {
		axios.get(`http://localhost:3030/post/`)
		.then(response => {
			setState({ posts: response.data.data })
		}).catch((error) => {
			console.log(error);
		})
	},[]);

  return (
    <div>
      <div className="NavBar">
        <AppBar/>
      </div>

      <div className="SideBar">
        <SideBar/>
      </div>

      <Router>
        <Box sx={{ flexGrow: 1 }} style={{marginLeft: 100, marginTop: 30, marginRight: 50, marginBottom: 30}}>
          <Routes>
            <Route exact path="/" element={postList("", state.posts)} />
            <Route exact path="/popular" element={postList("popular", state.posts)} />
            <Route exact path="/recent" element={postList("recent", state.posts)} />
            <Route exact path="/trending" element={postList("trending", state.posts)} />
          </Routes>
        </Box>
      </Router>
    </div>
  );
}

ReactDOM.render(<MyApp />, document.getElementById('root'));
