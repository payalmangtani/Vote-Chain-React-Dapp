import React from 'react';
import { useState , useEffect } from 'react';
import { Link } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import './signin.css';
import firebase  from 'firebase/compat/app';
import {auth} from '../index';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import UserNavbar from '../components/UserNavbar';
import ElectionDetails from '../pages/User/ElectionDetails';
import UserDashboard from './UserDashboard';
import {  createUserWithEmailAndPassword , signInWithEmailAndPassword } from "firebase/auth";
/*import $ from "jquery";*/

function SignIn() {

    const [credentials,setCredentials] = useState({email: "", name: "", password: ""})
    
   useEffect(() => {
        const signUpButton = document.getElementById('SignUp');
        const signInButton = document.getElementById('SignIn');
        const container = document.getElementById('signin-container');

        signUpButton.addEventListener('click',()=> {
            container.classList.add('right-panel-active');
        });

        signInButton.addEventListener('click',()=> {
            container.classList.remove('right-panel-active');
        });


    }, []);

    const handleUserInputChange = (event) => {
        event.preventDefault();
        const {name,value} = event.target;
        setCredentials((prev) => {
            return {...prev, [name] : value};
        });
    }

    const handleSignUpRequest = (event) => {
        event.preventDefault();
        
        auth.createUserWithEmailAndPassword( credentials.email, credentials.password)
        .then((userCredential) => {
            // Signed in 
            const user = userCredential.user;
            console.log("User successfully registered!");
            console.log(user);
            user.updateProfile({
                displayName : credentials.name,
            }).then(() => {
                console.log("user profile updated successfully");
                console.log(user);
                user.sendEmailVerification();
                console.log("verification email sent!");
            }) .catch((err)=> {
                console.log("Couldn't update user's profile" + err.message);
            }) 
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            // ..
        });
        
    }
    const handleSignInReqeust = (event) => {
        event.preventDefault();
        auth.signInWithEmailAndPassword(credentials.email , credentials.password)
        .then((userCredential) => {
            const user = userCredential.user;
            if(user.emailVerified){
               /* toast.success("Successfully signed in");*/
                window.location.href='/ElectionDetails';
                
            }else {
                toast.error("Please verify your email before signing in.");
                auth.signOut();
                user.sendEmailVerification();
            }
        });
    }

    return(
    <body className='signin-body'>
        <ToastContainer />
        <div className='signin-container' id="signin-container">
            <div className= 'form-container sign-up-container'>
                <form className='signin-form' action='#'>
                    <h1 className='signin-h1'>Create Account</h1>
                    <span className='signin-span'> Use email for registration </span>
                    <input className='signin-input' type= "text" placeholder= 'Name' name="name" value={credentials.name} onChange={handleUserInputChange}></input>
                    <input className='signin-input' type= 'email' placeholder= 'Email' name="email" value={credentials.email} onChange={handleUserInputChange}></input>
                    <input className='signin-input' type= 'password' placeholder= 'Password' name="password" value={credentials.password} onChange={handleUserInputChange}></input>
                    <button className='signin-button' onClick={handleSignUpRequest} > Sign Up</button>
                </form>
            </div>
            <div className= 'form-container sign-in-container'>
              <form className='signin-form' action='./UserNavbar'>
                  <h1 className='signin-h1'>Sign In</h1>
                  <span className='signin-span'> Use your account </span>
                  <input className='signin-input' type= "email" placeholder='Email' name="email" value={credentials.email} onChange={handleUserInputChange}></input>
                  <input className='signin-input' type= 'password' placeholder='Password' name="password" value={credentials.password} onChange={handleUserInputChange}></input>
                  <a className='signin-a' href = '#'>Forgot Your Password</a>
                  <Link to='./guidelines' ><button onClick={handleSignInReqeust}> Sign In</button></Link>
                </form>
            </div>
           <div className = 'overlay-container'>
               <div className = 'signin-overlay'>
                   <div className = 'overlay-panel overlay-left'>
                       <h1>Welcome</h1>
                       <p className='signin-p'>To continue please login</p>
                       <button href='./UserNavbar' className = 'ghost' id = 'SignIn'>Sign In</button>
                   </div>
                   <div className = 'overlay-panel overlay-right'>
                       <h1 className='signin-h1'> Hello </h1>
                       <p className='signin-p'> Enter your personal details and start with us </p>
                       <button className = 'ghost' id = 'SignUp'>Sign UP</button>
                    </div>
               </div>
           </div>
        </div>
    </body>
        
    );

}
export default SignIn;
