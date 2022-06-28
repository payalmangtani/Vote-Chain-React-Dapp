import React,{Component} from 'react';
import {Link} from 'react-router-dom';
import './Results.css';
import '../admin/Addcandidate.css'
import UserNavbar from '../../components/UserNavbar';
import AdminNavbar from '../../components/AdminNavbar';
import NotInit from "../../components/NotInit";

// Contract
import getWeb3 from "../../getWeb3";
import Election from "../../contracts/Election.json";
import StartEnd from '../../components/StartEnd';


export default class Results extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ElectionInstance: undefined,
      account: null,
      web3: null,
      isAdmin: false,
      candidateCount: undefined,
      candidates: [],
      isElStarted: false,
      isElEnded: false,
    };
  }
  componentDidMount = async () => {
    // refreshing once
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

      // Get total number of candidates
      const candidateCount = await this.state.ElectionInstance.methods
        .getTotalCandidate()
        .call();
      this.setState({ candidateCount: candidateCount });

      // Get start and end values
      const start = await this.state.ElectionInstance.methods.getStart().call();
      this.setState({ isElStarted: start });
      const end = await this.state.ElectionInstance.methods.getEnd().call();
      this.setState({ isElEnded: end });

      // Loadin Candidates detials
      for (let i = 1; i <= this.state.candidateCount; i++) {
        const candidate = await this.state.ElectionInstance.methods
          .candidateDetails(i - 1)
          .call();
        this.state.candidates.push({
          id: candidate.candidateId,
          image: candidate.image,
          header: candidate.header,
          slogan: candidate.slogan,
          voteCount: candidate.voteCount,
        });
      }

      this.setState({ candidates: this.state.candidates });

      // Admin account and verification
      const admin = await this.state.ElectionInstance.methods.getAdmin().call();
      if (this.state.account === admin) {
        this.setState({ isAdmin: true });
      }
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`
      );
      console.error(error);
    }
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
        <br />
        <div>
          {!this.state.isElStarted && !this.state.isElEnded ? (
            <NotInit />
          ) : this.state.isElStarted && !this.state.isElEnded ? (
            <div className="container-item attention">
              <center>
                <h3 style={{marginLeft:"570px"}}>The election is being conducted at the movement.</h3>
                <p>Result will be displayed once the election has ended.</p>
                <p>Go ahead and cast your vote {"(if not already)"}.</p>
                <br />
                <Link
                  to="/Vote"
                  style={{ color: "black", textDecoration: "underline" }}
                >
                  Voting Page
                </Link>
              </center>
            </div>
          ) : !this.state.isElStarted && this.state.isElEnded ? (
            displayResults(this.state.candidates)
          ) : null}
        </div>
      </>
    );
  }
}

function displayWinner(candidates) {
  const getWinner = (candidates) => {
    // Returns an object having maxium vote count
    let maxVoteRecived = 0;
    let winnerCandidate = [];
    for (let i = 0; i < candidates.length; i++) {
      if (candidates[i].voteCount > maxVoteRecived) {
        maxVoteRecived = candidates[i].voteCount;
        winnerCandidate = [candidates[i]];
      } else if (candidates[i].voteCount === maxVoteRecived) {
        winnerCandidate.push(candidates[i]);
      }
    }
    return winnerCandidate;
  };
  const renderWinner = (winner) => {
    return (
      <div className="container-winner">
        <div className="winner-info">
          <p className="winner-tag"><h1>Winner!</h1></p>
          <h2> {winner.header}</h2>
          <p className="winner-slogan">{winner.slogan}</p>
          <h2> Total Votes: {winner.voteCount}</h2>
        </div>
        <div className="winner-votes">
          <div className="vote-count"><img src={`https://ipfs.io/ipfs/${winner.image}`} style={{width:"200px", height:"200px"}} alt=""/></div>
        </div>
      </div>
    );
  };
  const winnerCandidate = getWinner(candidates);
  return <>{winnerCandidate.map(renderWinner)}</>;
}

export function displayResults(candidates) {
  const renderResults = (candidate) => {
    return (
      <tr > 
        <td>{candidate.id}</td>
        <td>{candidate.header}</td>
        <td>{candidate.voteCount}</td>
      </tr>
    );
  };
  return (
    <>
      {candidates.length > 0 ? (
        <div className="container-main">{displayWinner(candidates)}</div>
      ) : null}
      <div className="container-main" style={{ borderTop: "1px solid" }}>
        <center><h2>Results</h2></center>
        <small>Total candidates: {candidates.length}</small>
        {candidates.length < 1 ? (
          <div className="container-item attention">
            <center>No candidates.</center>
          </div>
        ) : (
          <>
            <div className="container-winner">
              <table className='candetails-table' >
                <tr style={{backgroundColor:"#90EE90"}} >
                  <th style={{paddingRight:"50px"}}>Id</th>
                  <th>Candidate</th>
                  <th>Votes</th>
                </tr>
                {candidates.map(renderResults)}
              </table>
            </div>
          </>
        )}
      </div>
    </>
  );
}