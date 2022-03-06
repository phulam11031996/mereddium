import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

import SideBar from './Components/Sidebar/sidebar';
import AppBar from './Components/AppBar/Appbar';
import ContentBox from './Components/ContentBox';

function MyApp() {

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

