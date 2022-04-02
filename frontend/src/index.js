import React from 'react';
import ReactDOM from 'react-dom';
import { AppRouter } from './app/router';
import './index.css';
const root = document.getElementById('root');

ReactDOM.render(
    <React.StrictMode>
        <AppRouter />
    </React.StrictMode>,
    root
);
