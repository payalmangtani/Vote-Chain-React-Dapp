/*import Button from '@restart/ui/esm/Button';*/
import React, {useState , useEffect, Component} from 'react';
import { Link } from 'react-router-dom';
import {db} from '../../index';
import AdminNavbar from '../../components/AdminNavbar';
import './Addcandidate.css'
import AdminOnly from "../../components/AdminOnly";
import getWeb3 from "../../getWeb3";
import Election from "../../contracts/Election.json";
import ipfs from '../../ipfs';

export default class Register extends Component {
    constructor(props) {
      super(props);
      this.state = {
        ElectionInstance: undefined,
        account: null,
        web3: null,
        isAdmin: false,
        voterCount: undefined,
        voters: [],
      };
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
        this.setState({ web3, ElectionInstance: instance, account: accounts[0] });
  
        // Total number of candidates
        const candidateCount = await this.state.ElectionInstance.methods
          .getTotalCandidate()
          .call();
        this.setState({ candidateCount: candidateCount });
  
        // Admin account and verification
        const admin = await this.state.ElectionInstance.methods.getAdmin().call();
        if (this.state.account === admin) {
          this.setState({ isAdmin: true });
        }
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
      } catch (error) {
        // Catch any errors for any of the above operations.
        alert(
          `Failed to load web3, accounts, or contract. Check console for details.`
        );
        console.error(error);
      }
    };
    renderUnverifiedVoters = (voter) => {
      const verifyVoter = async (verifiedStatus, address) => {
        await this.state.ElectionInstance.methods
          .verifyVoter(verifiedStatus, address)
          .send({ from: this.state.account, gas: 1000000 });
        window.location.reload();
      };
      return (
        <>
          {voter.isVerified ? (
            <h1></h1>
          ) : null}
          <div className="container-list attention" style={{ display: voter.isVerified ? "none" : null }}>
            <div className='register-body' style={{minHeight:"700px"}}>
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
                  <th>Identity Proof</th>
                  <td><img src={`https://ipfs.io/ipfs/${voter.idimage}`} style={{width:"400px", height:"400px"}} alt=""/></td>
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
            <div>
            <center>
            <button
              className="btn-verification approve"
              disabled={voter.isVerified}
              onClick={() => verifyVoter(true, voter.address)}
              style={{backgroundColor:"#00FFFF"}}
            >
              Approve
            </button>
            </center>
          </div>
        </div>
      </div>
    </>
      );
    };
    render() {
      if (!this.state.web3) {
        return (
          <>
            {this.state.isAdmin ? <AdminNavbar /> : <AdminNavbar />}
            <center>Loading Web3, accounts, and contract...</center>
          </>
        );
      }
      if (!this.state.isAdmin) {
        return (
          <>
            <AdminNavbar />
            <AdminOnly page="Verification Page." />
          </>
        );
      }
      return (
        <>
          <AdminNavbar/>
          <div className="container-main">
            <br />
            <center><h1>Verification</h1></center>
            <center><small>Total Voters: {this.state.voters.length}</small></center>
            <br />
            {this.state.voters.length >= 1 ? (
              <center><Link
              to="/Userinfo"
              style={{ color: "black", textDecoration: "underline" }}
              >
              See Verified Voters
              </Link>
              </center>
            ) :null}
            
            {this.state.voters.length < 1 ? (
              <div className="container-item info">None has registered yet.</div>
            ) : (
              <>
                <div className="container-item info">
                  <center><h1></h1></center>
                </div>
                {this.state.voters.map(this.renderUnverifiedVoters)}
              </>
            )}
         
         </div>
        </>
      );
    }
  }
