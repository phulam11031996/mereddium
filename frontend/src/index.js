import  React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import './index.css';

import SideBar from './Components/sidebar';
import AppBar from './Components/Appbar';
import ContentBox from './Components/ContentBox';

function MyApp() {

  let userId;
  const parseCookie = str =>
  str
  .split(';')
  .map(v => v.split('='))
  .reduce((acc, v) => {
    acc[decodeURIComponent(v[0].trim())] = decodeURIComponent(v[1].trim());
    return acc;
  }, {});

  if(document.cookie) {
    userId = parseCookie(document.cookie).userId;
  } else {
    userId = null;
  }

  return (
    <div>
    <div className="NavBar">
      <AppBar />
    </div>

    <div className="SideBar">
      <SideBar userId = {userId} />
    </div>

    <div className='Content'>
      <ContentBox userId = {userId} />
    </div>

    </div>
  );

}

ReactDOM.render(<MyApp />, document.getElementById('root'));

/*

 const [characters, setCharacters] = useState([]);

    async function fetchAll() {
    try {
      const response = await axios.get('http://localhost:3030/user');
      console.log(response.data.data.allUsers);
      return response.data.data.allUsers;
    }
    catch(error) {
      // We're not handling errors. Just logging into the console.
      console.log(error);
      return false;
    }
  }
  useEffect(() => {
    fetchAll().then( result => {
      if(result) {
        setCharacters(result);
      }
    });

  }, []);

  async function makePostCall(post) {
    try {
      const response = await axios.post('http://localhost:3030/post', post);
      return response;
    }
    catch (error) {
      console.log(error);
      return false;
    }
  };

  function updateList(post) {

    console.log(post);
  /*  makePostCall(post).then( result => {
      if(result.status === 201) {
        console.log(result.data.result);
        setCharacters([...characters, result.data.result]);
      }
    });

  }

  function deleteById(id) {
    makeDeleteCall(id).then( result => {
      if(result.status === 200) {
        console.log(result);
        const updated = characters.filter((character) => {
          if(result.data === character._id) {
            return false;
          }
          return true;
        });
        setCharacters(updated);
      }
    });
  }


  async function makeDeleteCall (id) {
    console.log(id);
    try {
      const response = await axios.delete('http://localhost:3030/user/'+id);
      console.log("IN waiting: " + response);
      return response;
    }
    catch(error) {
      console.log(error);
      return false;
    }
  }

<CreateButton handleSubmit={updateList}/>
<Table characterData={characters} removeCharacter={deleteById} />
<Form handleSubmit={updateList} />
<SideBar />

*/
