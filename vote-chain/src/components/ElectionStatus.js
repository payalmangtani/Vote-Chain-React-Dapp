import React from "react";
import '../pages/admin/Addcandidate.css';
import '../getWeb3';
import '../contracts/Election.json';
import '../pages/admin/StartEnd';

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
    <div
      className='candetails-box'
      >
      <h1 className='candetails-h1'>Election Status</h1>
      <table className='candetails-table'>
        <tr><td>Started: {props.elStarted ? "True" : "False"}</td></tr>
        <tr><td>Ended: {props.elEnded ? "True" : "False"}</td></tr>
      </table>
      <div className="container-item" />
    </div>
  );
};

export default ElectionStatus;