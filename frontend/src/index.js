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
    userId = -1;
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

