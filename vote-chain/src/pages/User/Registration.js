import React,{ useState ,Component} from 'react';
import './Registration.css';
import 'firebase/compat/auth';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import {auth} from '../../index';
import {db} from '../../index';
import {storage} from '../../index';
import UserNavbar from '../../components/UserNavbar';
import NotInit from "../../components/NotInit";
import getWeb3 from "../../getWeb3";
import Election from "../../contracts/Election.json";
import ipfs from '../../ipfs';


export default class Registration extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ElectionInstance: undefined,
      web3: null,
      account: null,
      isAdmin: false,
      isElStarted: false,
      isElEnded: false,
      voterCount: undefined,
      voterName: "",
      voterPhone: "",
      voters: [],
      currentVoter: {
        address: undefined,
        name: null,
        voterId: null,
        idimage: null,
        hasVoted: false,
        isVerified: false,
        isRegistered: false,
      },
    };
    this.captureFile = this.captureFile.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  // refreshing once
  componentDidMount = async () => {
    if (!window.location.hash) {
      window.location = window.location + "#loaded";
      window.location.reload();
    }
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();

      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = Election.networks[networkId];
      const instance = new web3.eth.Contract(
        Election.abi,
        deployedNetwork && deployedNetwork.address
      );

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState({
        web3: web3,
        ElectionInstance: instance,
        account: accounts[0],
      });

      // Admin account and verification
      const admin = await this.state.ElectionInstance.methods.getAdmin().call();
      if (this.state.account === admin) {
        this.setState({ isAdmin: true });
      }

      // Get start and end values
      const start = await this.state.ElectionInstance.methods.getStart().call();
      this.setState({ isElStarted: start });
      const end = await this.state.ElectionInstance.methods.getEnd().call();
      this.setState({ isElEnded: end });

      // Total number of voters
      const voterCount = await this.state.ElectionInstance.methods
        .getTotalVoter()
        .call();
      this.setState({ voterCount: voterCount });

      // Loading all the voters
      for (let i = 0; i < this.state.voterCount; i++) {
        const voterAddress = await this.state.ElectionInstance.methods
          .voters(i)
          .call();
        const voter = await this.state.ElectionInstance.methods
          .voterDetails(voterAddress)
          .call();
        this.state.voters.push({
          address: voter.voterAddress,
          name: voter.name,
          voterId: voter.voterId,
          idimage: voter.idimage,
          hasVoted: voter.hasVoted,
          isVerified: voter.isVerified,
          isRegistered: voter.isRegistered,
        });
      }
      this.setState({ voters: this.state.voters });

      // Loading current voters
      const voter = await this.state.ElectionInstance.methods
        .voterDetails(this.state.account)
        .call();
      this.setState({
        currentVoter: {
          address: voter.voterAddress,
          name: voter.name,
          voterId: voter.voterId,
          idimage: voter.idimage,
          hasVoted: voter.hasVoted,
          isVerified: voter.isVerified,
          isRegistered: voter.isRegistered,
        },
      });
    } catch (error) {
      // Catch any errors for any of the above operations.
      console.error(error);
      alert(
        `Failed to load web3, accounts, or contract. Check console for details (f12).`
      );
    }
  };
  updateVoterName = (event) => {
    this.setState({ voterName: event.target.value });
  };
  updateVoterId = (event) => {
    this.setState({ voterId: event.target.value });
  };

  captureFile(event) {
    event.preventDefault()
    this.setState({ idimage: event.target.value });
    const file = event.target.files[0]
    const reader = new window.FileReader()
    reader.readAsArrayBuffer(file)
    reader.onloadend = () => {
      this.setState({ buffer: Buffer(reader.result) })
      console.log('buffer', this.state.buffer)
    }
  }

  onSubmit(event) {
    event.preventDefault()
    ipfs.files.add(this.state.buffer, (error, result) => {
      if(error) {
        console.error(error)
        return
      }
      this.setState({ idimage: result[0].hash })
      console.log("okkk")
      
    })
  }
 
  registerAsVoter = async () => {
    await this.state.ElectionInstance.methods
      .registerAsVoter(this.state.voterName, this.state.voterId , this.state.idimage)
      .send({ from: this.state.account, gas: 1000000 });
    window.location.reload();
  };
  render() {
    if (!this.state.web3) {
      return (
        <>
          {this.state.isAdmin ? <UserNavbar /> : <UserNavbar />}
          <center>Loading Web3, accounts, and contract...</center>
        </>
      );
    }
    return (
      <>
        {this.state.isAdmin ? <UserNavbar /> : <UserNavbar />}
        {!this.state.isElStarted && !this.state.isElEnded ? (
          <NotInit/>
        ): (
          <>
            {this.state.currentVoter.isRegistered ? 
              <div className="register-bodyy" style={{minHeight:"700px"}}>
                <div className="container-main"
                    style={{
                        borderTop: this.state.currentVoter.isRegistered
                          ? null
                          : "1px solid",
                      }}
                    >
                    {loadCurrentVoter (
                        this.state.currentVoter,
                        this.state.currentVoter.isRegistered
                    )}
                </div>
              </div>
              :
              <div className='register-bodyy' style={{height:"330px"}}>
                <div className="container-main">
                  <h1>Registration</h1>
                  <small>Register to vote.</small>
                  <div className="container-item">
                    <form>
                      <div className="div-li">
                        <label className={"label-r"}>
                          Account Address
                          <input
                            className={"input-r"}
                            type="text"
                            value={this.state.account}
                            style={{ width: "400px" }}
                          />{" "}
                        </label>
                      </div>
                      <div className="div-li">
                        <label className={"label-r"}>
                          Name
                          <input
                            className={"input-r"}
                            type="text"
                            placeholder="eg. Ava"
                            value={this.state.voterName}
                            onChange={this.updateVoterName}
                          />{" "}
                        </label>
                      </div>
                      <div className="div-li">
                        <label className={"label-r"}>
                          Voter Id <span style={{ color: "tomato" }}>*</span>
                          <input
                            className={"input-r"}
                            type="number"
                            placeholder="eg. 9841234567"
                            value={this.state.voterId}
                            onChange={this.updateVoterId}
                          />
                        </label>
                      </div>
                      <div className="div-li">
                        <label className={"label-r"}>
                          Identity Proof <span style={{ color: "tomato" }}>*</span>
                          <input
                            className={"input-r"}
                            type="file"
                            placeholder="eg. .jpg/.png"
                            value={this.state.file}
                            onChange={this.captureFile}
                          />
                        </label>
                        <button
                          className="btn-add"
                          onClick={this.onSubmit}
                          style={{backgroundColor:"#90EE90"}}
                        >
                          Upload
                        </button>
                      </div>
                      <p className="note">
                        <span style={{ color: "tomato" }}> Note: </span>
                        <br /> Make sure your account address and Voter Id are
                        correct.
                        <br /> Upload Valid Identity Proof as mentioned in Election Details. 
                      </p>
                      <button className="btn-add"
                          style={{backgroundColor:"#90EE90"}}
                          onClick={this.registerAsVoter}
                        >
                          Register
                      </button>
                      </form>
                    </div>
                  </div>
                </div>}
          </>
        )}
      </>
    );
  }
}
export function loadCurrentVoter(voter, isRegistered) {
  return (
    <>
      <div className={"container-item " + (isRegistered ? "success" : "attention")}>
        <center><h2>Your Registered Info</h2></center>
      </div>
      <div className={"container-list " + (isRegistered ? "success" : "attention")} style={{paddingTop:"50px"}}>
        <table >
          <tr>
            <th>Account Address</th>
            <td>{voter.address}</td>
          </tr>
          <tr>
            <th>Name</th>
            <td>{voter.name}</td>
          </tr>
          <tr>
            <th>Voter Id</th>
            <td>{voter.voterId}</td>
          </tr>
          <tr>
              <th>Identity Proof</th>
              <td><img src={`https://ipfs.io/ipfs/${voter.idimage}`} style={{width:"400px", height:"300px"}} alt=""/></td>
              </tr>
          <tr>
            <th>Voted</th>
            <td>{voter.hasVoted ? "True" : "False"}</td>
          </tr>
          <tr>
            <th>Verification</th>
            <td>{voter.isVerified ? "True" : "False"}</td>
          </tr>
          <tr>
            <th>Registered</th>
            <td>{voter.isRegistered ? "True" : "False"}</td>
          </tr>
        </table>
      </div>
    </>
  );
}
export function loadAllVoters(voters) {
  const renderAllVoters = (voter) => {
    return (
      <>
        <div className="container-list success">
          <table>
            <tr>
              <th>Account address</th>
              <td>{voter.address}</td>
            </tr>
            <tr>
              <th>Name</th>
              <td>{voter.name}</td>
            </tr>
            <tr>
              <th>Voter Id</th>
              <td>{voter.voterId}</td>
            </tr>
            <tr>
              <th>Voted</th>
              <td>{voter.hasVoted ? "True" : "False"}</td>
            </tr>
            <tr>
              <th>Verified</th>
              <td>{voter.isVerified ? "True" : "False"}</td>
            </tr>
            <tr>
              <th>Registered</th>
              <td>{voter.isRegistered ? "True" : "False"}</td>
            </tr>
          </table>
        </div>
      </>
    );
  };
  return (
    <>
      <div className="container-item success">
        <center>List of voters</center>
      </div>
      {voters.map(renderAllVoters)}
    </>
  );
}