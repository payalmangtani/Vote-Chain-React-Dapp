import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
/*import { initializeApp } from 'firebase/app';*/
import firebase from 'firebase/compat/app';
import 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'firebase/database';
import 'firebase/compat/auth';
import 'firebase/compat/storage';

 
const firebaseConfig = {
  apiKey: "AIzaSyB2we3YNHO3KaabVw_cRL4RijrZ3yNKVdk",
  authDomain: "vote-chain-480aa.firebaseapp.com",
  projectId: "vote-chain-480aa",
  storageBucket: "vote-chain-480aa.appspot.com",
  messagingSenderId: "353297872952",
  appId: "1:353297872952:web:0455286ee9e20a002e4ecd"
};

firebase.initializeApp(firebaseConfig);
export const auth=firebase.auth();
export const storage = firebase.storage();
const db = firebase.firestore();

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);


export {db};