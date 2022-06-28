import React from 'react';
import styled from 'styled-components';
import {Link } from "react-router-dom";
import Img from '../assets/vote.jpg';
import './Home.css';

const Home = ({ account }) => {
    return (
        <>
            <section id="header" className="align-items-center">
                <div className="section">
                    <div>
                        <h1> <strong className="brand-name"> Vote-Chain {account} </strong></h1>
                    </div>
                    <div>
                        <h4>....A Secured Voting System</h4>
                    </div>
                    <div className="mt-3">
                        <Link to="./asignin"><a className="admin-btn-get-started ">
                            Admin
                        </a></Link>
                    </div>
                    <div className="mt-4">
                        <Link to="./signin"><a className="User-btn-get-started ">
                            User
                        </a></Link>
                    </div>
                </div>
                <div className="home-container">
                    <div className="header-img">
                        <img src={Img} className="img-fluid animated" alt="home img" />
                    </div>
                </div>
            </section>
        </>
    );
};

export default Home;
