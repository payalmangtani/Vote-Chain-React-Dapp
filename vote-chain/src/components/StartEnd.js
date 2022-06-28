import React from "react";
import { Link } from "react-router-dom";

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
    <div className="container-main" style={{ borderTop: "0px solid", marginLeft: "390px" }}>
        
      {!props.elStarted ? (
        <>
        <div className="container-main" style={{ borderTop: "0px solid", marginTop: "0px" }}></div>
          {/* edit here to display start election Again button */}
          {!props.elEnded ? (
            <div>
              <div className="container-item attention" style={{ display: "block"}}>
                <h2>Do not forget to add candidates.</h2>
                <p>
                  Go to{" "}
                  <Link
                    title="Add a new "
                    to="/candidate"
                    style={{
                      color: "black",
                      textDecoration: "underline",
                    }}
                  >
                    add candidates
                  </Link>{" "}
                  page.
                </p>
              </div>
              <div className="container-item">
                <button type="submit" style={{backgroundColor:"#00FFFF"}}>
                  Start Election {props.elEnded ? "Again" : null}
                </button>
              </div>
            </div>
          ) : (
            
            <div className="container-item">
              <center>
                <p style={{paddingRight:"400px"}}>Re-deploy the contract to start election again.</p>
              </center>
            </div>
          )}
          {props.elEnded ? (
            
            <div className="container-item">
              <center>
                <p style={{paddingRight:"400px"}}>The election ended.</p>
              </center>
            </div>
          ) : null}
        </>
      ) : (
        <>
          <div className="container-item">
              <br />
              <br />
              <br />
              <center>
                <h4 style={{paddingRight:"400px"}}>The election started.</h4>
              </center>
            </div>
            <div className="container-item">
              <br />
              <center style={{paddingRight:"400px"}}>
              <button
                type="button" style={{backgroundColor:"#00FFFF"}}
                // onClick={this.endElection}
                onClick={props.endElFn}
                >
                End
              </button>
              </center>
            </div>
          </>
      )}
    </div>
  );
};

export default StartEnd;