import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));

const documentHeight = () => {
  const doc = document.documentElement
  doc.style.setProperty('--doc-height', `${window.innerHeight}px`)
}
window.addEventListener('resize', documentHeight)
documentHeight()

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

