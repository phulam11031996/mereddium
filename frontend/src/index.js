import  {React, useState, useEffect} from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import Table from './Table';
import Form from './form';
import './index.css';

function MyApp() {
  const [characters, setCharacters] = useState([]);

    async function fetchAll() {
    try {
      const response = await axios.get('http://localhost:3030/users');
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

  async function makePostCall(person) {
    try {
      const response = await axios.post('http://localhost:3030/users', person);
      return response;
    }
    catch (error) {
      console.log(error);
      return false;
    }
  };

  function updateList(person) {
    makePostCall(person).then( result => {
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
      const response = await axios.delete('http://localhost:3030/users/'+id);
      console.log("IN waiting: " + response);
      return response;
    }
    catch(error) {
      console.log(error);
      return false;
    }
  }


  return (
    <div className="container">
      <Table characterData={characters} removeCharacter={deleteById} />
      <Form handleSubmit={updateList} />
    </div>
  );

}

ReactDOM.render(<MyApp />, document.getElementById('root'));
