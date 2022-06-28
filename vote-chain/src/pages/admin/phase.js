import React ,{Component}from 'react';
import './phase.css';
import AdminNavbar from '../../components/AdminNavbar';
import Election from "../../contracts/Election.json";
import AdminOnly from "../../components/AdminOnly";
import getWeb3 from "../../getWeb3";
import "../admin/Addcandidate.css";
import "../../components/ElectionStatus";

const ElectionStatus = (props) => {
  const electionStatus = {
    padding: "11px",
    margin: "7px",
    width: "100%",
    border: "1px solid tomato",
    marginLeft: "auto",
    marginRight: "auto",
    textAlign: "center",
    borderRadius: "0.5em",
    overflow: "auto",
    alignItems: "center",
    justifyContent: "space-around",
    display: "flex",
  };
  return (
    <>
    <AdminNavbar />
    <div className='candetails-box' style={{marginLeft:"300px", marginTop:"100px"}}>
      <div className="container-item" />
      <ElectionStatus 
            elStarted={props.elStarted}
            elEnded={props.elEnded}
      />
    </div>
    </>
  );
};

export default ElectionStatus;