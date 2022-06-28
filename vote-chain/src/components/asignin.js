import React from "react";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import "./asignin.css";
import Img1 from '../assets/admin.png';
import CreateElection from "../pages/admin/CreateElection";
/*import $ from "jquery";*/

function AsignIn() {
    /*useEffect(() => {
        const signInButton = document.getElementById('SignIn');
        const container = document.getElementById('asignin-container');
        signInButton.addEventListener('click',()=> {
            container.classList.remove('right-panel-active');
        });
    }, [])*/

    return(
        <body className='asignin-body'>
        <div className='asignin-container' id="container">
            <div className= 'form-container sign-in-container'>
              <form class='asignin-form' action='#'>
                  <h1 className='asignin-h1'>Sign In</h1>
                  <span className='asignin-span'> Use your account </span>
                  <input className='asignin-input' type= "email" placeholder='Email'></input>
                  <input classname='asignin-input' type= 'password' placeholder='Password'></input>
                  <a className='asignin-a' href = '#'>Forgot Your Password</a>
                  <Link to="./CreateElection"><button className='asignin-button'> Sign In</button></Link>
             </form>
        </div>
           <div className = 'overlay-container'>
               <div className = 'overlay'>
                   <div className = 'overlay-panel overlay-left'>
                       <h1 className='asignin-h1'>Welcome</h1>
                       <p className='asignin-p'>To continue please login</p>
                       <button className = 'ghost' id = 'SignIn'>Sign In</button>
                   </div>
                   <div className = 'overlay-panel overlay-right'>
                        <img src={Img1} className='img' alt="img" />
                   </div>
                </div>
           </div>
        </div>
        </body>
    );

}
export default AsignIn;