import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

import SideBar from './Components/Sidebar/sidebar';
import AppBar from './Components/AppBar/Appbar';
import ContentBox from './Components/ContentBox';
import { editorConstructor } from './Components/editor';

function MyApp() {

  const editor = editorConstructor ();
  
  function printOutput() {
    editor.save().then((outputData) => {
      console.log('article data: ', outputData)
    }).catch((error) => {
      console.log('Saving failed: ', error)
    })
  }

  return (
    <div>
        <div className="NavBar">
          <AppBar/>
        </div>

        <div className="SideBar">
          <SideBar/>
        </div>

        <div className='Content'>
          <ContentBox/>
        </div>
    </div>
  );

}

ReactDOM.render(<MyApp />, document.getElementById('root'));

