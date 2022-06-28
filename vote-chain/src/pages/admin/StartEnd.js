import React from "react";
import { Link } from "react-router-dom";
import './phase.css';
import AdminNavbar from '../../components/AdminNavbar';

const StartEnd = (props) => {
  const btn = {
    display: "block",
    padding: "21px",
    margin: "7px",
    minWidth: "max-content",
    textAlign: "center",
    width: "333px",
    alignSelf: "center",
  };
  return (
    <>
    <AdminNavbar /> 
    <div className="container-main" style={{ borderTop: "1px solid", marginTop: "0px" }}>
      {!props.elStarted ? (
        <>
          {/* edit here to display start election Again button */}
          {!props.elEnded ? (
              <body className='phase-body'>
                <tabel className='content-table'>
                  <thead className='thead'>
                      <tr>
                      <th>Create Election</th>
                      </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>
                        <button type="submit" style={{backgroundColor:"#00FFFF"}}>
                          Start Election {props.elEnded ? "Again" : null}
                        </button>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <h2>Do not forget to add candidates.</h2>
                        <p>
                          Go to{" "}
                          <Link
                            title="Add a new "
                            to="/Candidate"
                            style={{
                              color: "black",
                              textDecoration: "underline",
                            }}
                          >
                            add candidates
                          </Link>{" "}
                          page.
                        </p>
                      </td>
                    </tr>
                </tbody>
              </tabel>
            </body>
          ) : (
            <div className="container-item">
              <center>
                <p>Re-deploy the contract to start election again.</p>
              </center>
            </div>
          )}
          {props.elEnded ? (
            <div className="container-item">
              <center>
                <p>The election ended.</p>
              </center>
            </div>
          ) : null}
        </>
      ) : (
        <>
          <div className="container-item">
            <center>
              <p>The election started.</p>
            </center>
          </div>
          <div className="container-item">
            <button
              type="button"
              // onClick={this.endElection}
              onClick={props.endElFn}
              style={{backgroundColor:"#00FFFF"}}
            >
              End
            </button>
          </div>
        </>
      )}
    </div>
    </>
  );
};

export default StartEnd;