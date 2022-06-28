import React,{Component,useState} from 'react';
import './Addcandidate.css';
import AdminNavbar from '../../components/AdminNavbar';
import UserNavbar from '../../components/UserNavbar';
import getWeb3 from "../../getWeb3";
import Election from "../../contracts/Election.json";
import { makeStyles } from '@material-ui/core/styles';
import AdminOnly from "../../components/AdminOnly";
import ipfs from '../../ipfs';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';
import {
   CardText, CardBody, CardImg,
  CardTitle, CardSubtitle, Button, Row, Col, Container
} from 'reactstrap';




export default class candidateInfo extends Component {
 

    constructor(props) {
      super(props);
      this.state = {
        ElectionInstance: undefined,
        web3: null,
        accounts: null,
        isAdmin: false,
        image: "",
        header: "",
        slogan: "",
        candidates: [],
        candidateCount: undefined,
        buffer: null,
        setBuffer: null
      };
    }

    
    componentDidMount = async () => {
      // refreshing page only once
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
  
        // Total number of candidates
        const candidateCount = await this.state.ElectionInstance.methods
          .getTotalCandidate()
          .call();
        this.setState({ candidateCount: candidateCount });
  
        const admin = await this.state.ElectionInstance.methods.getAdmin().call();
        if (this.state.account === admin) {
          this.setState({ isAdmin: true });
        }
  
        // Loading Candidates details
        for (let i = 0; i < this.state.candidateCount; i++) {
          const candidate = await this.state.ElectionInstance.methods
            .candidateDetails(i)
            .call();
          this.state.candidates.push({
            id: candidate.candidateId,
            image: candidate.image,
            header: candidate.header,
            slogan: candidate.slogan,
          });
        }
  
        this.setState({ candidates: this.state.candidates });
      } catch (error) {
        // Catch any errors for any of the above operations.
        console.error(error);
        alert(
          `Failed to load web3, accounts, or contract. Check console for details.`
        );
      }
    };
   
    captureFile(event) {
      event.preventDefault()
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
        this.ElectionInstance.set(result[0].hash, { from: this.state.account }).then((r) => {
          return this.setState({ image: result[0].hash })
          console.log('image', this.state.image)
        })
      })
    }
    
      
    updateHeader = (event) => {
      this.setState({ header: event.target.value });
    };
    updateSlogan = (event) => {
      this.setState({ slogan: event.target.value });
    };
  
    addCandidate = async () => {
      await this.state.ElectionInstance.methods
        .addCandidate(this.state.image, this.state.header, this.state.slogan)
        .send({ from: this.state.account, gas: 1000000 });
      window.location.reload();
    };
  
    render() {
      if (!this.state.web3) {
        return (
          <>
            {this.state.isAdmin ? <UserNavbar /> : <AdminNavbar />}
            <center>Loading Web3, accounts, and contract...</center>
          </>
        );
      }
      if (!this.state.isAdmin) {
        return (
          <>
            <AdminNavbar />
            <AdminOnly page="Add Candidate Page." />
          </>
        );
      }
      return (
        <>
          <AdminNavbar />
          {loadAdded(this.state.candidates)}
        </>
      );
    }
  }
  export function loadAdded(candidates) {
    const renderAdded = (candidate) => {
      return (
        <>
          <div className="container-winner">
            <div className="winner-info">
              <p className="winner-tag"><h1></h1></p>
              <h2>Name: {candidate.header}</h2>
              <p className="winner-slogan">Slogan: {candidate.slogan}</p>
            </div>
            <div className="winner-votes">
              <div className="votes-tag"></div>
              <div className="vote-count"><img src={`https://ipfs.io/ipfs/${candidate.image}`} style={{width:"200px", height:"200px"}} alt=""/></div>
            </div>
          </div>
        </>
      );
    };
    return (
      <div className="container-main" style={{ borderTop: "1px solid" }}>
        <div className="container-item info">
          <center><h1 style={{marginTop:"50px"}}>Candidates List</h1></center>
        </div>
        {candidates.length < 1 ? (
          <div className="container-item alert">
            <center>No candidates added.</center>
          </div>
        ) : (
          <div className="container-item">
            <div className="container-main" style={{marginLeft:"200px"}}>
              {candidates.map(renderAdded)}
            </div>
          </div>
        )}
      </div>
    );
  }
  