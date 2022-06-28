import React from "react";
import "../pages/User/Registration.css"

function UserHome(props) {
  return (
    <div>
        <div className="register-bodyy" style={{height:"350px"}}>
            <div className="container-list title">
              <center>
              <h1><p style={{paddingTop:"50px"}}>Election Title : {props.el.electionTitle} </p></h1>
              </center>
              <br />
              <center><h3 style={{marginLeft:"400px"}}>Organization Name : {props.el.organizationTitle}</h3></center>
              <table style={{ marginTop: "40px" }}>
                <tr>
                  <th style={{paddingLeft:"220px"}}>admin:</th>
                  <td>
                    {props.el.adminName} ({props.el.adminTitle})
                  </td>
                </tr>
                <tr>
                  <th style={{paddingLeft:"220px"}}>contact:</th>
                  <td style={{ textTransform: "none" }}>{props.el.adminEmail}</td>
                </tr>
                <tr>
                  <th style={{paddingLeft:"220px"}}>required identity proof:</th>
                  <td style={{ textTransform: "none" }}>{props.el.idProof}</td>
                </tr>
              </table>
            </div>
        </div>
        <p className="note" style={{marginLeft:"360px"}}>
            <span style={{ color: "tomato" }}> Note: </span>
            <br /> Election is initialised. <br /> Kindly Register yourself to proceed further.
        </p>
    </div>
  );
}

export default UserHome;